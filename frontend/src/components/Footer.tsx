import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900/95 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-primary-glow" />
            <span className="text-lg font-semibold text-white">MindfulTech</span>
          </div>

          {/* Educational Disclaimer */}
          <div className="max-w-2xl">
            <p className="text-yellow-400 font-medium mb-2">
              ⚠️ Educational Project Disclaimer
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              This digital wellness assessment is an educational project exclusively designed for classroom use. 
              It is not intended to provide professional medical, psychological, or therapeutic advice. 
              For actual health concerns, please consult qualified healthcare professionals.
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-white/10 w-full">
            <p className="text-white/60 text-xs">
              © {new Date().getFullYear()} MindfulTech Educational Project. For classroom use only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
