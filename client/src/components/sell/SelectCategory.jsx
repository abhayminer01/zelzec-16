import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { useModal } from "../../contexts/ModalContext";
import { useSell } from "../../contexts/SellContext";
import { getPrimaryCategories } from "../../services/category-api";
import MobileBottomNav from "../MobileBottomNav";


export default function SelectCategory() {
  const [categories, setCategories] = useState([]);
  const { closeLogin } = useModal();
   const {
    step,
    nextStep,
    prevStep,
    handleCategorySelect
  } = useSell();

  useEffect(() => {
    fetchPrimaryCategories();
  }, []);

  const handleBackdropClick = () => {
    prevStep();
  };
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const fetchPrimaryCategories = async () => {
    const req = await getPrimaryCategories();
    if(req.success) {
      setCategories(req.data);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 md:bg-black/50 bg-white md:flex md:items-center md:justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-none md:rounded-2xl shadow-xl w-full h-full md:w-[450px] md:h-auto p-6 md:p-8 flex flex-col relative overflow-y-auto"
        onClick={handleModalClick}
      >
        <div className="flex items-center mb-6 md:mb-6">
          <button 
            onClick={prevStep}
            className="md:hidden mr-3"
          >
            <Icons.ArrowLeft className="size-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-left md:text-center flex-1 md:flex-none">
            What are you Selling?
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-10 w-full">
          {categories.map((item, index) => {
            const Icon = Icons[item.icon];
            return (
              <button
                onClick={() => {
                  handleCategorySelect(item._id);
                  localStorage.setItem('category', item._id);
                  nextStep();
                }}
                key={index}
                className="flex flex-col items-center justify-center border border-gray-300 rounded-lg py-6 md:py-4 hover:border-primary hover:text-primary transition"
              >
                {Icon && <Icon className="size-8 md:size-6 text-primary mb-2 md:mb-1" />}
                <span className="text-sm font-medium">{item.title}</span>
              </button>
            );
          })}
          
        </div>
        <button 
          className="flex flex-col w-full mt-6 md:mt-10 items-center justify-center border border-gray-300 rounded-lg py-6 md:py-4 hover:border-primary hover:text-primary transition"
        >
          <Icons.MoreHorizontal className="text-primary size-6"/>
          <span className="text-sm font-medium">More Categories</span>
        </button>
      </div>
      <MobileBottomNav />
    </div>
  );
}