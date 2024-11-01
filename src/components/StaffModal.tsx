import { useState } from 'react';

interface StaffMember {
  name: string;
  title: string;
  image: string;
  bio: string;
}

interface Props {
  member: StaffMember;
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffModal({ member, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="aspect-square mb-6 bg-gray-200 rounded-xl overflow-hidden">
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-staff.jpg';
              }}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-600">{member.title}</h3>
            <p className="text-gray-600 leading-relaxed">{member.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}