'use client';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import FolderIcon from './ui/folder';
import UserIcon from './ui/account';

const Navbar = () => {
    const [isDark, setIsDark] = useState<Boolean>(false);


    const switchAction = () => {
        setIsDark((prev) => !prev)

        if (!isDark) {
            document.getElementById("body")?.classList.add("dark");
            return;
        }
        document.getElementById("body")?.classList.remove("dark");
    };

    return (
        <div className="flex w-full h-16 bg-[#2974AA] shadow-[inset_0px_35px_30px_#205F8D] border border-black justify-between items-center p-6">

            <h1 className="font-mono text-2xl text-white">TaskFlow</h1>

            <div className='flex gap-6'>
                <Switch onCheckedChange={switchAction} />
                <FolderIcon />
                <UserIcon />
            </div>
        </div>
    )
}


export default Navbar;