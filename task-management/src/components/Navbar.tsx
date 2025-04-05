'use client';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import FolderIcon from './ui/folder';
import UserIcon from './ui/account';

const Navbar = () => {
    const [isDark, setIsDark] = useState<Boolean>(false);


    const switchAction = () => {
        setIsDark((prev) => {
            const newValue = !prev;

            if (newValue) {
                document.getElementById("body")?.classList.add("dark");
            } else {
                document.getElementById("body")?.classList.remove("dark");
            }

            return newValue;
        });
    };
    return (
        <div className="flex w-full h-16 bg-[#2974AA] shadow-[inset_0px_35px_30px_#205F8D] border border-black justify-between items-center p-6">

            <a className='select-none' href="/"><h1 className="font-mono hover:cursor-pointer  text-2xl text-white">TaskFlow</h1></a>

            <div className='flex gap-6'>
                <Switch onCheckedChange={switchAction} />
                <a href=""><FolderIcon /></a>
                <a href="/profile"><UserIcon /></a>
            </div>
        </div>
    )
}


export default Navbar;