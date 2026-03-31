import React from 'react'
import { useNavigate } from 'react-router-dom'

const EditorPreview = () => {
    const navigate = useNavigate()
    return (
        <div className='bg-[#111] min-h-screen'>

            <div className='text-white'>
                <h1 className='text-4xl font-bold flex items-center justify-center pt-4'>Editor de sitios</h1>
                <p className='text-lg flex items-center justify-center'>Gargobarb cuenta con un editor de sitios para que puedas crear tu propio sitio web con tu barberia</p>
                <button className='flex items-center justify-center mt-4 bg-[#D4AF37] text-black px-4 py-2 rounded-lg absolute top-4 left-4 border border-[#D4AF37]' onClick={() => navigate('/')}>Volver</button>
                <img src="/Barbershopeditor.png" alt="" className='w-[600px] h-[350px] flex items-center justify-center mt-4' />
                {/*este texto tiene que estar al lado de la imagen */}
                <p className='text-lg flex items-center justify-center mt-4'>Este es un ejemplo de como se ve el editor de sitios</p>
                <div className='flex items-center justify-center mt-4'>

                </div>

            </div>




        </div>
    )
}

export default EditorPreview