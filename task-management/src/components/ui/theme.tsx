import { Moon, Sun } from "lucide-react";
import { ReactEventHandler, useState } from "react";

const DarkModeToggle = (isDark: boolean, toogleDarkMode: () => void) => {

    return (
        <div className="w-12 h-6 bg-[#3AA4CB] rounded-full flex items-center p-1 cursor-pointer shadow-md" onClick={toogleDarkMode}>
            <div className={`w-5 h-5 bg-white rounded-full justify-center transition-all duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>
                {isDark ? <Moon className="w-4 h-4 m-auto text-cyan-950" /> : <Sun className="w-4 h-4 m-auto text-yellow-500" />}
            </div>
        </div>
    );
};

export default DarkModeToggle;
