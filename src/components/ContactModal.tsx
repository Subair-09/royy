import React, { useState } from 'react';
import { Mail, Phone, MapPin, X, CheckCircle2, Send, Sparkles, AlertCircle } from 'lucide-react';
import { validateEmail, validateName, validateStudentId, validatePhone, validateRequiredText } from '../utils/formValidation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    enquiryType: 'Result Discrepancy',
    message: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const validateField = (field: string, value: string) => {
    let error: string | undefined;
    if (field === 'name') {
      const res = validateName(value, 'Full Name', 2);
      if (!res.isValid) error = res.error;
    } else if (field === 'email') {
      const res = validateEmail(value, true);
      if (!res.isValid) error = res.error;
    } else if (field === 'phone' && value.trim()) {
      const res = validatePhone(value, false);
      if (!res.isValid) error = res.error;
    } else if (field === 'studentId' && value.trim()) {
      const res = validateStudentId(value, false);
      if (!res.isValid) error = res.error;
    } else if (field === 'message') {
      const res = validateRequiredText(value, 'Message', 10, 1000);
      if (!res.isValid) error = res.error;
    }

    setFormErrors(prev => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
    return error;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, (formData as any)[field]);
  };

  const handleChange = (field: string, rawValue: string) => {
    let sanitizedValue = rawValue;
    if (field === 'name') {
      // Disallow numbers in name field
      sanitizedValue = rawValue.replace(/[0-9]/g, '');
    } else if (field === 'studentId') {
      // Disallow letters in student ID (numbers only)
      sanitizedValue = rawValue.replace(/\D/g, '').slice(0, 12);
    } else if (field === 'phone') {
      // Numbers only, exactly max 11 digits
      sanitizedValue = rawValue.replace(/\D/g, '').slice(0, 11);
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    if (touched[field]) {
      validateField(field, sanitizedValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ name: true, email: true, phone: true, studentId: true, message: true });

    const errors: Record<string, string> = {};
    const nameVal = validateName(formData.name, 'Full Name', 2);
    if (!nameVal.isValid) errors.name = nameVal.error!;

    const emailVal = validateEmail(formData.email, true);
    if (!emailVal.isValid) errors.email = emailVal.error!;

    if (formData.phone.trim()) {
      const phoneVal = validatePhone(formData.phone, false);
      if (!phoneVal.isValid) errors.phone = phoneVal.error!;
    }

    if (formData.studentId.trim()) {
      const idVal = validateStudentId(formData.studentId, false);
      if (!idVal.isValid) errors.studentId = idVal.error!;
    }

    const msgVal = validateRequiredText(formData.message, 'Message', 10, 1000);
    if (!msgVal.isValid) errors.message = msgVal.error!;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        studentId: '',
        enquiryType: 'Result Discrepancy',
        message: ''
      });
      setFormErrors({});
      setTouched({});
      onClose();
    }, 2500);
  };

  return (
    <div id="contact" className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-slate-900 relative">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1E3A8A] text-[10px] font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Faith Academy IT & Help Desk</span>
          </div>
          <h3 className="text-xl font-black text-[#0F172A] font-['Plus_Jakarta_Sans']">
            Contact Portal Support
          </h3>
          <p className="text-xs text-slate-500">
            Have a question about result checking or need grade verification support?
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-900">Enquiry Submitted Successfully!</h4>
            <p className="text-xs text-emerald-700">
              Our academic support desk has received your ticket and will contact you via email within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Your Full Name *
                </label>
                {touched.name && formErrors.name && (
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.name}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g. Dr. Robert Okon"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                  touched.name && formErrors.name
                    ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#1E3A8A]'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email Address *
                  </label>
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="parent@example.com"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                    touched.email && formErrors.email
                      ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#1E3A8A]'
                  }`}
                />
                {touched.email && formErrors.email && (
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formErrors.email}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Student Reg ID (Optional)
                  </label>
                </div>
                <input
                  type="text"
                  maxLength={12}
                  value={formData.studentId}
                  onChange={(e) => handleChange('studentId', e.target.value)}
                  onBlur={() => handleBlur('studentId')}
                  placeholder="e.g. 2025104 (numbers only)"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all ${
                    touched.studentId && formErrors.studentId
                      ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#1E3A8A]'
                  }`}
                />
                {touched.studentId && formErrors.studentId && (
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formErrors.studentId}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Phone Number (11 Digits, Optional)
                </label>
                {touched.phone && formErrors.phone && (
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formErrors.phone}
                  </span>
                )}
              </div>
              <input
                type="tel"
                maxLength={11}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="e.g. 08012345678 (11 digits)"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                  touched.phone && formErrors.phone
                    ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#1E3A8A]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.enquiryType}
                onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              >
                <option value="Result Discrepancy">Result Discrepancy Query</option>
                <option value="Verification Request">Official Transcript Verification</option>
                <option value="Technical Support">Portal Technical Issue</option>
                <option value="General Admission">General Admission / Other</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Message / Details *
                </label>
                <span className={`text-[10px] font-mono ${formData.message.trim().length < 10 ? 'text-slate-400' : 'text-emerald-600'}`}>
                  {formData.message.trim().length}/1000 characters
                </span>
              </div>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                onBlur={() => handleBlur('message')}
                placeholder="Describe your inquiry with at least 10 characters..."
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                  touched.message && formErrors.message
                    ? 'border-red-400 bg-red-50/50 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#1E3A8A]'
                }`}
              />
              {touched.message && formErrors.message && (
                <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {formErrors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E3A8A] hover:bg-[#1e40af] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Send className="w-4 h-4 text-[#F59E0B]" />
              <span>Submit Message to Support</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
