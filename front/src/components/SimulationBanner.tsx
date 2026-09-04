export default function SimulationBanner() {
    return (
        <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 font-medium my-2">
            <span className="font-bold">[SIMULATION]</span>
            <span>Ce service est un démonstrateur (pas de valeur réelle / DSP2).</span>
        </div>
    );
}