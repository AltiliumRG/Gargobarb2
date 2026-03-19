import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    format,
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    parseISO,
    eachDayOfInterval
} from "date-fns";
import { getSalesByBarbershop, getRequiredDataForSale, createSale, bulkCreateSales } from "../api/sale.api";
import { createService as apiCreateService } from "../api/services.api";
import toast from "react-hot-toast";

export function useDashboardData() {
    const { barbershopId } = useParams();
    const [allSales, setAllSales] = useState([]);
    const [availableBarbers, setAvailableBarbers] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dateRange, setDateRange] = useState({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
    });

    const fetchData = useCallback(async () => {
        if (!barbershopId) return;
        setLoading(true);
        try {
            const [salesRes, dataRes] = await Promise.all([
                getSalesByBarbershop(barbershopId),
                getRequiredDataForSale(barbershopId)
            ]);

            if (salesRes.data.ok) setAllSales(salesRes.data.sales);
            if (dataRes.data.ok) {
                setAvailableBarbers(dataRes.data.barbers);
                setAvailableServices(dataRes.data.services);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Error al cargar datos del dashboard");
        } finally {
            setLoading(false);
        }
    }, [barbershopId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addNewSale = async (saleData) => {
        try {
            const res = await createSale({ ...saleData, barbershop_id: barbershopId });
            if (res.data.ok) {
                toast.success("Venta registrada");
                fetchData(); // Refresh all data
                return true;
            }
        } catch (error) {
            console.error("Error creating sale:", error);
            toast.error("Error al registrar la venta");
            return false;
        }
    };

    const addService = async (serviceData) => {
        try {
            const res = await apiCreateService({ ...serviceData, barbershop_id: barbershopId });
            if (res.status === 201) {
                toast.success("Servicio creado correctamente");
                fetchData(); // Refresh to get updated list
                return true;
            }
        } catch (error) {
            console.error("Error creating service:", error);
            toast.error("Error al crear el servicio");
            return false;
        }
    };

    const importSales = async (salesArray) => {
        try {
            const salesWithShop = salesArray.map(s => ({ ...s, barbershop_id: barbershopId }));
            const res = await bulkCreateSales(salesWithShop);
            if (res.data.ok) {
                toast.success(res.data.message);
                fetchData();
                return true;
            }
        } catch (error) {
            console.error("Error importing sales:", error);
            toast.error("Error al importar ventas");
            return false;
        }
    };

    // 1. Filtered Data
    const filteredSales = useMemo(() => {
        return allSales.filter(sale => {
            const saleDate = parseISO(sale.date);
            return isWithinInterval(saleDate, {
                start: startOfDay(dateRange.start),
                end: endOfDay(dateRange.end)
            });
        });
    }, [allSales, dateRange]);

    // 2. Derived Stats
    const stats = useMemo(() => {
        const completed = filteredSales.filter(s => s.status === "completada");
        const totalIncome = completed.reduce((sum, s) => sum + parseFloat(s.price), 0);
        const uniqueClients = new Set(allSales.map(s => s.client_name)).size;

        // Income by barber
        const incomeByBarber = availableBarbers.map(barber => {
            const barberSales = completed.filter(s => s.barber_id === barber.id);
            return {
                id: barber.id,
                name: barber.full_name || barber.username,
                value: barberSales.reduce((sum, s) => sum + parseFloat(s.price), 0),
                count: barberSales.length
            };
        }).sort((a, b) => b.value - a.value);

        // Income by service
        const incomeByService = availableServices.map(svc => {
            const svcSales = completed.filter(s => s.service_id === svc.id);
            return {
                id: svc.id,
                name: svc.name,
                value: svcSales.reduce((sum, s) => sum + parseFloat(s.price), 0),
                count: svcSales.length
            };
        }).sort((a, b) => b.value - a.value);

        // Today's summary
        const todayStr = format(new Date(), "yyyy-MM-dd");
        const todaySales = allSales.filter(s => s.date === todayStr);
        const todayAppointmentsCount = todaySales.length;
        const pendingToday = todaySales.filter(s => s.status === "pendiente");

        const pendingByBarber = availableBarbers.map(barber => ({
            name: barber.full_name || barber.username,
            count: todaySales.filter(s => s.barber_id === barber.id && s.status === "pendiente").length
        }));

        // Client Loyalty
        const clientFrequency = {};
        allSales.forEach(s => {
            clientFrequency[s.client_name] = (clientFrequency[s.client_name] || 0) + 1;
        });
        const loyalClients = Object.entries(clientFrequency)
            .map(([name, count]) => ({
                name,
                count,
                revenue: allSales.filter(s => s.client_name === name && s.status === "completada").reduce((sum, s) => sum + parseFloat(s.price), 0)
            }))
            .sort((a, b) => b.count - a.count);

        return {
            totalIncome,
            totalSales: completed.length,
            uniqueClients,
            activeBarbers: availableBarbers.length,
            todayAppointmentsCount,
            pendingToday: pendingToday.length,
            incomeByBarber,
            incomeByService,
            pendingByBarber,
            loyalClients,
            cancellationRate: (filteredSales.filter(s => s.status === "cancelada").length / (filteredSales.length || 1) * 100).toFixed(1),
            averageTicket: (totalIncome / (completed.length || 1)).toFixed(2)
        };
    }, [filteredSales, allSales, availableBarbers, availableServices]);

    // 3. Time Series Data for Charts
    const incomeSeries = useMemo(() => {
        const start = dateRange.start;
        const end = dateRange.end;
        try {
            const days = eachDayOfInterval({ start, end });
            return days.map(day => {
                const dayStr = format(day, "yyyy-MM-dd");
                const daySales = filteredSales.filter(s => s.date === dayStr && s.status === "completada");
                return {
                    date: format(day, "dd/MM"),
                    income: daySales.reduce((sum, s) => sum + parseFloat(s.price), 0),
                    fullDate: dayStr
                };
            });
        } catch (e) {
            return [];
        }
    }, [filteredSales, dateRange]);

    return {
        allSales,
        filteredSales,
        stats,
        incomeSeries,
        dateRange,
        setDateRange,
        BARBERS: availableBarbers.map(b => b.full_name || b.username),
        SERVICES: availableServices,
        availableBarbers,
        availableServices,
        loading,
        addNewSale,
        addService,
        importSales,
        refresh: fetchData
    };
}
