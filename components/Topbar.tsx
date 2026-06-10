import { Phone, Mail, HelpCircle, Share2, Camera, PlayCircle } from "lucide-react";

export default function Topbar() {
  return (
    <div className="bg-[#0b0f19] text-gray-300 text-xs py-2 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center border-b border-gray-800">
      <div className="flex items-center space-x-6 mb-2 md:mb-0">
        <div className="flex items-center space-x-2">
          <HelpCircle size={14} className="text-gray-400" />
          <span>24/7 Customer Support</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={14} className="text-[#ff6b00]" />
          <span>+1 (888) 123-4567</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail size={14} className="text-[#ff6b00]" />
          <span>info@sharkskylink.com</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for Facebook */}
        <Share2 size={14} className="hover:text-white cursor-pointer" />
        
        {/* Placeholder for Instagram */}
        <Camera size={14} className="hover:text-white cursor-pointer" />
        
        {/* Placeholder for YouTube */}
        <PlayCircle size={14} className="hover:text-white cursor-pointer" />
        
        {/* TikTok placeholder text */}
        <span className="font-bold hover:text-white cursor-pointer">TikTok</span> 
      </div>
    </div>
  );
}