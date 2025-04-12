// "use client";

// import Link from "next/link";
// import { useState, useEffect } from "react";

// export default function Navbar() {
//   const [isEnglish, setIsEnglish] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   const toggleLanguage = () => {
//     setIsEnglish(!isEnglish);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = () => {
//       if (isMobileMenuOpen) setIsMobileMenuOpen(false);
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [isMobileMenuOpen]);

//   return (
//     <nav className="w-full py-4 px-4 sm:px-6 bg-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="flex items-center space-x-2 group">
//           <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse-border">
//             <img 
//               src="/images/favicon.ico" 
//               alt="BASSLINE Logo" 
//               className="h-5 w-5"
//             />
//           </div>
//           <span className="text-red-600 font-bold text-xl tracking-tight group-hover:animate-glow transition-all duration-300">
//             BASSLINE
//           </span>
//         </Link>
        
//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-6">
//           <Link 
//             href="/" 
//             className="text-red-500 hover:text-red-700 font-medium transition-colors duration-300 relative group"
//           >
//             <span>{isEnglish ? "Home" : "Beranda"}</span>
//             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
//           </Link>
          
//           <Link 
//             href="/map" 
//             className="text-red-500 hover:text-red-700 font-medium transition-colors duration-300 relative group"
//           >
//             <span>{isEnglish ? "Map" : "Peta"}</span>
//             <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
//           </Link>
          
//           {/* <button 
//             onClick={toggleLanguage}
//             className="px-4 py-2 bg-white text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors duration-300 text-sm font-medium"
//           >
//             {isEnglish ? "ID 🇮🇩" : "EN 🇬🇧"}
//           </button> */}
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button 
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleMobileMenu();
//             }}
//             className="text-red-500 p-2"
//             aria-label="Toggle mobile menu"
//           >
//             {isMobileMenuOpen ? (
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div 
//           className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 border-t border-red-100"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="container mx-auto py-4 px-6 flex flex-col space-y-4">
//             <Link 
//               href="/" 
//               className="text-red-500 hover:text-red-700 font-medium py-2 transition-colors duration-300"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               {isEnglish ? "Home" : "Beranda"}
//             </Link>
            
//             <Link 
//               href="/map" 
//               className="text-red-500 hover:text-red-700 font-medium py-2 transition-colors duration-300"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               {isEnglish ? "Map" : "Peta"}
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
