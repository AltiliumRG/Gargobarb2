import os
import re

path = r"c:\Users\USUARIO\Downloads\Gargobarb2-avanzado\Gargobarb2-avanzado\frontend\src\pages\barber\Settings.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
import_old = '''import ProfileSection from "./SettingsSections/ProfileSection";
import SecuritySection from "./SettingsSections/SecuritySection";'''
import_new = '''import ProfileSection from "./SettingsSections/ProfileSection";
import SecuritySection from "./SettingsSections/SecuritySection";
import PaymentSection from "./SettingsSections/PaymentSection";'''
content = content.replace(import_old, import_new)

icon_old = '''    ArrowLeft,
    Settings as SettingsIcon
} from "lucide-react";'''
icon_new = '''    ArrowLeft,
    Settings as SettingsIcon,
    CreditCard
} from "lucide-react";'''
content = content.replace(icon_old, icon_new)

# 2. Form Data
form_old = '''    longitude: null,
    logo_url: null,
    is_active: true
  });'''
form_new = '''    longitude: null,
    logo_url: null,
    is_active: true,
    payment_method: "",
    payment_data: null
  });'''
content = content.replace(form_old, form_new)

# 3. Fetch
fetch_old = '''          longitude: res.data.longitude,
          logo_url: res.data.logo_url,
          is_active: res.data.is_active
        });'''
fetch_new = '''          longitude: res.data.longitude,
          logo_url: res.data.logo_url,
          is_active: res.data.is_active,
          payment_method: res.data.site?.payment_method || "",
          payment_data: res.data.site?.payment_data || null
        });'''
content = content.replace(fetch_old, fetch_new)

# 4. Tabs
tab_old = '''    { id: "barberia", label: "Mi Barbería", icon: <Store size={18} /> },
    { id: "perfil", label: "Mi Perfil", icon: <User size={18} /> },
    { id: "seguridad", label: "Seguridad", icon: <ShieldCheck size={18} /> },
  ];'''
tab_new = '''    { id: "barberia", label: "Mi Barbería", icon: <Store size={18} /> },
    { id: "pagos", label: "Finanzas y Pagos", icon: <CreditCard size={18} /> },
    { id: "perfil", label: "Mi Perfil", icon: <User size={18} /> },
    { id: "seguridad", label: "Seguridad", icon: <ShieldCheck size={18} /> },
  ];'''
content = content.replace(tab_old, tab_new)

# 5. Main content
main_old = '''            {activeTab === "seguridad" && (
                <SecuritySection user={user} />
            )}
        </main>'''
main_new = '''            {activeTab === "seguridad" && (
                <SecuritySection user={user} />
            )}
            
            {activeTab === "pagos" && (
                <PaymentSection 
                    barbershopId={barbershopId}
                    initialMethod={formData.payment_method}
                    initialData={formData.payment_data}
                />
            )}
        </main>'''
content = content.replace(main_old, main_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
