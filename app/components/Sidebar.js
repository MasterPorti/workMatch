import { HiHome, HiUser, HiBriefcase } from "react-icons/hi";

export default function Sidebar() {
  return (
    <div className="w-16 h-full flex flex-col items-center py-4 border-r border-gray-400/50">
      <svg
        width="29"
        height="29"
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        <path
          d="M7.36938 22.7361V13.2665C8.01668 6.84553 19.2982 4.07392 21.61 13.2665C21.9799 16.0689 20.9719 21.7014 13.9811 21.8123C12.3628 21.5351 12.3166 18.163 13.9811 18.163C18.7615 18.163 20.0842 11.2339 14.4897 10.9106C13.565 0.9106 11.8285 11.145 10.9758 13.5436C10.9758 14.837 10.7292 20.3495 10.9758 22.5052C11.284 23.583 12.5848 25.6833 15.3219 25.4615C18.7434 25.1844 25.9561 21.7661 25.2626 14.1903C24.5691 6.61457 19.8993 4.07391 14.4897 3.61198C9.0801 3.15004 3.20817 9.06283 3.62429 15.0218C3.20817 16.1766 1.42348 17.4239 0.017911 15.0218C-0.244099 10.3562 2.26387 0.437464 14.4897 0.00887692C25.0314 -0.360675 29.7012 10.9106 28.9152 14.6984C28.9152 19.3178 25.0129 28.8984 15.3219 28.9723C12.9793 29.1878 8.10913 28.2424 7.36938 22.7361Z"
          fill="#EE4266"
        />
      </svg>
      <div className="flex flex-col items-center gap-6">
        <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
          <HiHome className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
        </div>
        <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
          <HiUser className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
        </div>
        <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-100/50 cursor-pointer transition-all duration-300">
          <HiBriefcase className="text-2xl text-[#EE4266] cursor-pointer hover:text-[#d13a5c]" />
        </div>
      </div>
    </div>
  );
}
