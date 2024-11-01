import React from "react";
import { Input } from "@nextui-org/react";

export default function InputRips({ label, placeholder, value, onChange }) {
    const variants = "flat";

    return (
        <div className="w-[320px] flex flex-col gap-4">
            <div key={variants} className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                <Input
                    type="text"
                    variant={variants}
                    label={label}
                    placeholder={placeholder}
                    value={value} // Asignar el valor
                    onChange={onChange} // Manejar el cambio
                />
            </div>
        </div>
    );
}
