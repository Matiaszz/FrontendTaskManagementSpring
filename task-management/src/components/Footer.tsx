const Footer = () => {
    return (
        <footer className="w-full h-16 bg-[#2974AA] flex justify-center items-center p-6">
            <div className="flex justify-center gap-1 ">
                <span className="drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)] text-white">©</span>
                <span className="text-[#A7E7FF] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/Matiaszz">Matias</a>
                </span>
                <span className="text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">, Todos os direitos reservados -</span>
                <span className="text-[#A7E7FF] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">2025</span>
            </div>
        </footer>
    );
}

export default Footer;
