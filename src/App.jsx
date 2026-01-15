import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Menu, 
  X, 
  Lock, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Leaf, 
  Activity, 
  Heart, 
  MapPin, 
  ArrowRight, 
  MessageCircle, 
  Printer,
  Settings,
  Grid,
  List,
  Ban,
  Mail
} from 'lucide-react';

// --- CONFIGURATION ---
// IMPORTANT: Replace these values with your actual Firebase project keys
// Go to Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyDJosQQhRGcebaxJQ37gNTnqXawsYHO9oI",
  authDomain: "harmony-acupuncture.firebaseapp.com",
  projectId: "harmony-acupuncture",
  storageBucket: "harmony-acupuncture.firebasestorage.app",
  messagingSenderId: "78608558880",
  appId: "1:78608558880:web:adbb1fe3596d2b88c58545"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Translations & Content ---
const TRANSLATIONS = {
  en: {
    menu: {
      home: "Home",
      appointments: "Appointments",
      services: "Services",
      about: "About",
      testimonials: "Testimonials"
    },
    title: "Wellspring Acupuncture",
    subtitle: "Integrative Medicine & Wellness",
    login: "Staff All Login",
    logout: "Logout",
    heroTitle: "Restore Your Vitality",
    heroSubtitle: "Experience the profound benefits of traditional acupuncture in a modern, serene setting.",
    bookNow: "Book an Appointment",
    learnMore: "Learn More",
    welcomeTitle: "Welcome to Wellspring",
    welcomeText: "We are dedicated to providing personalized care that addresses the root cause of your health concerns. Our clinic offers a sanctuary for healing, combining ancient wisdom with modern medical understanding.",
    bookingTitle: "Schedule Your Visit",
    bookingSubtitle: "Select a time that works for you. Private treatment sessions available every 15 minutes.",
    selectDate: "Select Date",
    full: "Booked",
    blocked: "Blocked",
    bookSlot: "Request Appointment",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    email: "Email Address",
    enterDetails: "Patient Details",
    requiredFields: "*All fields are required",
    confirm: "Confirm Request",
    cancel: "Cancel",
    adminMode: "Admin Portal",
    adminPass: "Access Code",
    bookingSuccess: "Appointment Requested",
    viewBookings: "Scheduled Patients",
    noBookings: "No appointments scheduled.",
    myBookings: "My Appointments",
    findBooking: "Manage My Appointments",
    enterPhoneToFind: "Enter your phone number to find existing appointments.",
    search: "Find Appointments",
    cancelAppt: "Cancel",
    confirmCancel: "Cancel this appointment?",
    past: "Past",
    footer: "© 2025 Wellspring Acupuncture. All rights reserved.",
    settings: "Settings",
    daysAheadLabel: "Booking Window (Weeks)",
    daysAheadDesc: "How many weeks ahead can patients book?",
    save: "Save Settings",
    saved: "Settings Saved!",
    weekView: "Week View",
    dayView: "Day View",
    blockRange: "Block Time Range",
    blockRangeTitle: "Block Multiple Slots",
    startTime: "Start Time",
    endTime: "End Time",
    blockConfirm: "Block Selected Range",
    apptDetails: "Appointment Details",
    servicesPage: {
      title: "Our Specialties",
      subtitle: "Comprehensive care for your well-being",
      list: [
        { title: "Acupuncture", desc: "Stimulate your body's natural healing abilities to reduce pain and inflammation." },
        { title: "Cupping", desc: "Improve blood flow and relaxation with traditional vacuum therapy." },
        { title: "Herbal Medicine", desc: "Custom herbal formulas tailored to your specific constitution." },
        { title: "Fertility Support", desc: "Specialized treatments to support reproductive health and wellness." }
      ]
    },
    aboutPage: {
      title: "Our Philosophy",
      p1: "Founded on the principles of compassion and integrity, Wellspring Acupuncture has served the community for over 15 years.",
      p2: "Our practitioners are licensed and board-certified, bringing decades of combined experience to your treatment plan.",
      stats: ["15+ Years", "5k+ Patients", "Licensed Pros"]
    },
    testimonialsPage: {
      title: "Patient Stories",
      list: [
        { name: "Sarah J.", text: "The most relaxing medical experience I've ever had." },
        { name: "Michael C.", text: "Professional, clean, and incredibly effective." },
        { name: "Emily R.", text: "Dr. Wei really listens. I felt heard and cared for." }
      ]
    }
  },
  zh: {
    menu: {
      home: "首頁",
      appointments: "線上預約",
      services: "服務項目",
      about: "關於我們",
      testimonials: "見證"
    },
    title: "源泉針灸中心",
    subtitle: "中西醫結合 • 全人健康",
    login: "員工全然登入",
    logout: "登出",
    heroTitle: "調理身心，恢復平衡",
    heroSubtitle: "在現代舒適的環境中，體驗傳統針灸的深層療效。",
    bookNow: "立即預約",
    learnMore: "了解更多",
    welcomeTitle: "歡迎來到源泉",
    welcomeText: "我們致力於提供個性化的護理，解決您健康問題的根源。",
    bookingTitle: "預約您的診療",
    bookingSubtitle: "選擇適合您的時間。每15分鐘提供一個私人治療時段。",
    selectDate: "選擇日期",
    full: "已預約",
    blocked: "保留",
    bookSlot: "預約時段",
    firstName: "名字",
    lastName: "姓氏",
    phone: "電話號碼",
    email: "電子郵件",
    enterDetails: "患者資料",
    requiredFields: "*所有欄位皆為必填",
    confirm: "確認預約",
    cancel: "取消",
    adminMode: "管理後台",
    adminPass: "訪問代碼",
    bookingSuccess: "預約已送出",
    viewBookings: "已預約患者",
    noBookings: "此時段無預約",
    myBookings: "我的預約",
    findBooking: "管理我的預約",
    enterPhoneToFind: "輸入電話號碼以查詢預約",
    search: "搜尋",
    cancelAppt: "取消",
    confirmCancel: "確定要取消此預約嗎？",
    past: "已過",
    footer: "© 2025 源泉針灸中心 版權所有",
    settings: "設置",
    daysAheadLabel: "開放預約週數",
    daysAheadDesc: "允許患者提前多少週預約？",
    save: "保存設置",
    saved: "設置已保存！",
    weekView: "週視圖",
    dayView: "日視圖",
    blockRange: "批量封鎖時段",
    blockRangeTitle: "封鎖時段範圍",
    startTime: "開始時間",
    endTime: "結束時間",
    blockConfirm: "封鎖選定範圍",
    apptDetails: "預約詳情",
    servicesPage: {
      title: "專業服務",
      subtitle: "為您量身定制的整體療法",
      list: [
        { title: "傳統針灸", desc: "激發身體的自然癒合能力，減少疼痛和炎症。" },
        { title: "拔罐療法", desc: "利用真空療法促進血液循環和肌肉放鬆。" },
        { title: "中藥調理", desc: "根據您的體質定制的草本配方。" },
        { title: "助孕調理", desc: "支持生殖健康和福祉的專業治療。" }
      ]
    },
    aboutPage: {
      title: "我們的理念",
      p1: "源泉針灸中心建立在同情和誠信的原則之上，服務社區已超過15年。",
      p2: "我們的醫師均持有執照和委員會認證，為您的治療計劃帶來數十年的綜合經驗。",
      stats: ["15年+ 經驗", "5000+ 患者", "認證專家"]
    },
    testimonialsPage: {
      title: "患者心聲",
      list: [
        { name: "Sarah J.", text: "這是我經歷過最放鬆的醫療體驗。" },
        { name: "Michael C.", text: "專業、乾淨，而且非常有效。" },
        { name: "Emily R.", text: "魏醫生真的很用心聽。" }
      ]
    }
  }
};

const MAX_SLOTS = 1;

// --- Helper Functions ---

const parseLocal = (dateStr) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate 15-minute intervals for the day
const getDailySlots = (dateStr) => {
  const date = parseLocal(dateStr);
  const day = date.getDay(); // 0 = Sun, 6 = Sat
  
  if (day === 0) return []; // Sunday closed

  // M-F (1-5): 9am to 4pm
  // Sat (6): 9am to 3pm
  let startHour = 9;
  let endHour = day === 6 ? 15 : 16; 

  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endHour && m > 0) break; // End exactly at the hour
      slots.push(`${h}:${m === 0 ? '00' : m}`);
    }
  }
  return slots;
};

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-emerald-800">
        <div className="p-4 flex justify-between items-center border-b border-stone-100">
          <h3 className="text-emerald-900 font-serif font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-emerald-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-900 mb-3">{title}</h2>
    {subtitle && <p className="text-stone-500 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="h-0.5 w-16 bg-emerald-600 mx-auto mt-4"></div>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [appointments, setAppointments] = useState([]);
  const [settings, setSettings] = useState({ bookingWindowWeeks: 4 }); 
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [viewMonth, setViewMonth] = useState(new Date());
  
  const [viewMode, setViewMode] = useState('day'); 
  const [weekStartDate, setWeekStartDate] = useState(new Date());

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBlockRangeOpen, setIsBlockRangeOpen] = useState(false); 
  // New state for viewing specific booking details in week view
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [adminPass, setAdminPass] = useState('');
  const [formError, setFormError] = useState('');

  const [blockStartTime, setBlockStartTime] = useState('09:00');
  const [blockEndTime, setBlockEndTime] = useState('12:00');

  const [cancelPhone, setCancelPhone] = useState('');
  const [foundBookings, setFoundBookings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error(err));
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'appointments');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const settingsDoc = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(settingsDoc, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [user]);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'config'), settings, { merge: true });
      setIsSettingsOpen(false);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const getSlotData = (dateStr, slotTime) => {
    const slotAppointments = appointments.filter(
      app => app.date === dateStr && app.hour === slotTime
    );
    const isBlocked = slotAppointments.some(app => app.type === 'blocked');
    const bookings = slotAppointments.filter(app => app.type === 'booking');
    const remaining = MAX_SLOTS - bookings.length;
    return { isBlocked, bookings, remaining: isBlocked ? 0 : remaining };
  };

  const isDateAllowed = (dateStr) => {
    if (isAdmin) return true;
    const weeks = parseInt(settings.bookingWindowWeeks || 4);
    const days = weeks * 7;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + days);
    
    const selected = parseLocal(dateStr);
    
    return selected <= maxDate && selected >= today;
  };

  const handleBookClick = (slotTime) => {
    setSelectedSlot(slotTime);
    setIsBookingModalOpen(true);
    setFormError('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
      setFormError(t.requiredFields);
      return;
    }
    
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      await addDoc(collection(db, 'appointments'), {
        date: selectedDate,
        hour: selectedSlot,
        type: 'booking',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName, 
        phone,
        email,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      await addDoc(collection(db, 'mail'), {
        to: [email, 'wellspringacuherb@gmail.com'],
        message: {
          subject: `Appointment Confirmation: ${fullName} on ${selectedDate}`,
          text: `Dear ${firstName},\n\nYour appointment has been confirmed.\n\nDate: ${selectedDate}\nTime: ${selectedSlot}\nLocation: 655 Concord Street, Framingham 01702\nPhone: 508-628-1888\n\nTo cancel or reschedule, please visit our website.\n\nThank you,\nWellspring Acupuncture`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #064e3b;">Appointment Confirmed</h2>
              <p>Dear ${firstName},</p>
              <p>Your appointment has been successfully booked.</p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
                <p><strong>Date:</strong> ${selectedDate}</p>
                <p><strong>Time:</strong> ${selectedSlot}</p>
                <p><strong>Patient:</strong> ${fullName}</p>
              </div>
              <p><strong>Location:</strong><br/>655 Concord Street, Framingham 01702</p>
              <p><strong>Phone:</strong> 508-628-1888</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">Wellspring Acupuncture</p>
            </div>
          `
        }
      });
      
      setIsBookingModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Booking failed. Please try again.');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPass === '8888') {
      setIsAdmin(true);
      setIsAdminLoginOpen(false);
      setAdminPass('');
    } else {
      setFormError(lang === 'en' ? 'Invalid Code' : '代碼錯誤');
    }
  };

  const toggleBlockSlot = async (dateStr, slotTime, isCurrentlyBlocked) => {
    if (!isAdmin) return;
    try {
      if (isCurrentlyBlocked) {
        const blockDoc = appointments.find(
          app => app.date === dateStr && app.hour === slotTime && app.type === 'blocked'
        );
        if (blockDoc) {
          await deleteDoc(doc(db, 'appointments', blockDoc.id));
        }
      } else {
        await addDoc(collection(db, 'appointments'), {
          date: dateStr,
          hour: slotTime,
          type: 'blocked',
          blockedBy: user.uid,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  const handleRangeBlockSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const startMins = timeToMinutes(blockStartTime);
    const endMins = timeToMinutes(blockEndTime);
    const dailySlots = getDailySlots(selectedDate);
    const slotsToBlock = dailySlots.filter(slot => {
      const slotMins = timeToMinutes(slot);
      return slotMins >= startMins && slotMins < endMins;
    });

    try {
      const batch = writeBatch(db);
      slotsToBlock.forEach(slot => {
        const existing = appointments.find(
          app => app.date === selectedDate && app.hour === slot
        );
        if (!existing) {
          const docRef = doc(collection(db, 'appointments'));
          batch.set(docRef, {
            date: selectedDate,
            hour: slot,
            type: 'blocked',
            blockedBy: user.uid,
            createdAt: serverTimestamp()
          });
        }
      });
      await batch.commit();
      setIsBlockRangeOpen(false);
    } catch (err) {
      console.error("Error batch blocking:", err);
    }
  };

  const handleDeleteBooking = async (id, confirmMsg) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setFoundBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleSearchBookings = (e) => {
    e.preventDefault();
    const results = appointments.filter(
      app => app.phone === cancelPhone && app.type === 'booking'
    );
    results.sort((a, b) => new Date(a.date) - new Date(b.date) || a.hour.localeCompare(b.hour));
    setFoundBookings(results);
    setHasSearched(true);
  };

  const openCancelModal = () => {
    setIsCancelModalOpen(true);
    setCancelPhone('');
    setFoundBookings([]);
    setHasSearched(false);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(viewMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewMonth(newDate);
  };

  const changeWeek = (offset) => {
    const newDate = new Date(weekStartDate);
    newDate.setDate(newDate.getDate() + (offset * 7));
    setWeekStartDate(newDate);
  };

  const renderWeekView = () => {
    const dates = [];
    const start = new Date(weekStartDate);
    start.setDate(start.getDate() - start.getDay()); 
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(formatDate(d));
    }

    const allSlots = [];
    for (let h = 9; h <= 16; h++) {
        for (let m = 0; m < 60; m += 15) {
            // Cap at 16:00 to keep grid clean
            if (h === 16 && m > 0) break;
            allSlots.push(`${h}:${m === 0 ? '00' : m}`);
        }
    }

    return (
      <div className="overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
           <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-stone-100 rounded-full"><ChevronLeft size={20}/></button>
           <div className="font-bold text-lg text-emerald-900">
             {new Date(dates[0]).toLocaleDateString()} - {new Date(dates[6]).toLocaleDateString()}
           </div>
           <button onClick={() => changeWeek(1)} className="p-2 hover:bg-stone-100 rounded-full"><ChevronRight size={20}/></button>
        </div>

        <div className="min-w-[800px] bg-white border border-stone-200 text-xs">
          <div className="grid grid-cols-8 border-b border-stone-200 bg-stone-50">
            <div className="p-2 font-bold text-stone-400 text-center border-r">Time</div>
            {dates.map(dateStr => {
               const d = parseLocal(dateStr);
               return (
                 <div key={dateStr} className={`p-2 text-center border-r font-bold ${d.getDay() === 0 ? 'bg-stone-100 text-stone-400' : 'text-emerald-900'}`}>
                   {d.toLocaleDateString(lang === 'en'?'en-US':'zh-TW', {weekday:'short'})} <br/>
                   {d.getDate()}
                 </div>
               );
            })}
          </div>

          {allSlots.map(time => (
            <div key={time} className="grid grid-cols-8 border-b border-stone-100 h-10 hover:bg-stone-50">
              <div className="p-2 text-center border-r font-mono text-stone-500 flex items-center justify-center bg-stone-50">
                {time}
              </div>
              {dates.map(dateStr => {
                const day = parseLocal(dateStr).getDay();
                if (day === 0) return <div key={dateStr} className="bg-stone-100 border-r"></div>;
                
                const [h, m] = time.split(':').map(Number);
                // M-F ends at 16:00
                if (day >= 1 && day <= 5) {
                    if (h > 16 || (h === 16 && m > 0)) return <div key={dateStr} className="bg-stone-100 border-r"></div>;
                }
                // Sat ends at 15:00
                if (day === 6) {
                    if (h > 15 || (h === 15 && m > 0)) return <div key={dateStr} className="bg-stone-100 border-r"></div>;
                }

                const { isBlocked, bookings } = getSlotData(dateStr, time);
                const isBooked = bookings.length > 0;

                return (
                  <div 
                    key={dateStr} 
                    className={`border-r p-1 transition-colors cursor-pointer flex items-center justify-center
                      ${isBlocked ? 'bg-stone-200' : isBooked ? 'bg-emerald-100' : 'hover:bg-emerald-50'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isBooked) {
                        setSelectedBookingDetails(bookings[0]);
                      } else {
                        toggleBlockSlot(dateStr, time, isBlocked);
                      }
                    }}
                    title={isBooked ? `${bookings[0].name}\n${bookings[0].phone}\n${bookings[0].email}` : isBlocked ? 'Blocked' : 'Available'}
                  >
                    {isBlocked && <X size={12} className="text-stone-400"/>}
                    {isBooked && (
                      <div className="text-[10px] leading-tight text-emerald-900 font-bold truncate w-full text-center">
                        {bookings[0].firstName || bookings[0].name} 
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDailyView = () => {
    const dailySlots = getDailySlots(selectedDate);
    const isAllowedDate = isDateAllowed(selectedDate);

    return (
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <div className="bg-white p-6 shadow-lg border border-stone-100 sticky top-24">
            <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2 uppercase tracking-wide text-sm border-b border-stone-100 pb-2">
              <Calendar size={16} /> {t.selectDate}
            </h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500"><ChevronLeft size={20}/></button>
                <span className="font-bold text-stone-700">
                  {viewMonth.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { year: 'numeric', month: 'long' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-stone-100 rounded-full text-stone-500"><ChevronRight size={20}/></button>
              </div>
              
              <div className="grid grid-cols-7 text-center mb-2">
                {(lang === 'en' ? ['S','M','T','W','T','F','S'] : ['日','一','二','三','四','五','六']).map(d => (
                  <div key={d} className="text-xs font-bold text-stone-400">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const year = viewMonth.getFullYear();
                  const month = viewMonth.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const startDay = firstDay.getDay();
                  const slots = [];
                  for(let i=0; i<startDay; i++) slots.push(<div key={`empty-${i}`} />);
                  for(let i=1; i<=lastDay.getDate(); i++) {
                    const date = new Date(year, month, i);
                    const dateStr = formatDate(date);
                    const isSelected = dateStr === selectedDate;
                    const isPast = date < new Date(new Date().setHours(0,0,0,0));
                    
                    const isAllowed = isDateAllowed(dateStr); 
                    
                    slots.push(
                      <button
                        key={dateStr}
                        onClick={() => !isPast && isAllowed && setSelectedDate(dateStr)}
                        disabled={isPast || !isAllowed}
                        className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center text-sm transition-all ${
                          isSelected ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-emerald-50 text-stone-600'
                        } ${isPast || !isAllowed ? 'text-stone-300 cursor-not-allowed opacity-50 hover:bg-transparent' : ''}`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return slots;
                })()}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-sm border border-emerald-100">
              <div className="text-xs text-emerald-800 font-bold uppercase mb-2">Selected Date</div>
              <div className="text-xl font-serif font-bold text-emerald-900">
                {parseLocal(selectedDate).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-TW', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2">
             <h3 className="text-lg font-bold text-emerald-900 uppercase tracking-wide text-sm">
                Available Times <span className="text-xs normal-case text-stone-500 font-normal ml-2">EST</span>
             </h3>
             {isAdmin && (
               <div className="flex gap-2">
                 <button 
                   onClick={() => setIsBlockRangeOpen(true)} 
                   className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-900 px-3 py-1 rounded-full font-bold transition-colors"
                 >
                   <Ban size={14}/> {t.blockRange}
                 </button>
                 <button 
                   onClick={() => setViewMode('week')} 
                   className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold transition-colors"
                 >
                   <Grid size={14}/> {t.weekView}
                 </button>
               </div>
             )}
          </div>
          
          {dailySlots.length === 0 ? (
            <div className="text-center py-12 text-stone-500 bg-stone-50 border border-dashed border-stone-200">
              <Clock className="mx-auto mb-2 text-stone-400" />
              <p>Closed on Sundays. Please select another date.</p>
            </div>
          ) : !isAllowedDate && !isAdmin ? (
             <div className="text-center py-12 text-red-500 bg-red-50 border border-dashed border-red-200">
               <Calendar className="mx-auto mb-2 opacity-50" />
               <p>Booking not yet open for this date.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {dailySlots.map((slot) => {
                const { isBlocked, remaining, bookings } = getSlotData(selectedDate, slot);
                const now = new Date();
                const isToday = selectedDate === formatDate(now);
                const [h, m] = slot.split(':').map(Number);
                const slotDate = new Date();
                slotDate.setHours(h, m, 0, 0);
                const isPastTime = isToday && slotDate < now;
                const isFull = remaining === 0;
                
                return (
                  <div key={slot} className="bg-white border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-emerald-200 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Clock size={18} className="text-emerald-700" />
                        <span className="text-xl font-serif font-bold text-stone-800">{slot}</span>
                      </div>
                      <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                        {isBlocked ? (
                          <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{t.blocked}</span>
                        ) : isPastTime ? (
                          <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded">{t.past}</span>
                        ) : isFull ? (
                          <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded">{t.full}</span>
                        ) : (
                          <span className="text-emerald-600 px-2 py-0.5 rounded"></span>
                        )}
                      </div>
                    </div>

                    {!isAdmin ? (
                      <button
                        onClick={() => handleBookClick(slot)}
                        disabled={isFull || isBlocked || isPastTime}
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all min-w-[140px] ${
                          isFull || isBlocked || isPastTime
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm'
                        }`}
                      >
                        {isBlocked || isFull || isPastTime ? 'Unavailable' : 'Select'}
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => toggleBlockSlot(selectedDate, slot, isBlocked)} className="text-xs bg-stone-200 hover:bg-stone-300 px-3 py-2 font-bold uppercase">{isBlocked ? t.unblock : 'Block'}</button>
                      </div>
                    )}
                    
                    {isAdmin && bookings.length > 0 && (
                      <div className="w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 sm:border-l sm:border-stone-100 sm:pl-4">
                        {bookings.map(b => (
                          <div key={b.id} className="text-xs mb-1 flex items-center justify-between gap-2 bg-stone-50 p-1.5 rounded">
                            <div className="overflow-hidden">
                              <div className="font-bold truncate">{b.name}</div>
                              <div className="text-stone-500">{b.phone}</div>
                              <div className="text-stone-400 truncate" title={b.email}>{b.email}</div>
                            </div>
                            <div className="flex gap-1 self-start">
                              <a href={`tel:${b.phone}`} className="p-1 bg-white border hover:bg-emerald-50" title="Call"><Phone size={12}/></a>
                              <a href={`sms:${b.phone}`} className="p-1 bg-white border hover:bg-emerald-50" title="Text"><MessageCircle size={12}/></a>
                              <a href={`mailto:${b.email}`} className="p-1 bg-white border hover:bg-emerald-50" title="Email"><Mail size={12}/></a>
                              <button onClick={() => handleDeleteBooking(b.id)} className="p-1 bg-white border hover:bg-red-50 text-red-600" title="Delete"><Trash2 size={12}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointments = () => (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <div className="bg-emerald-900 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t.bookingTitle}</h2>
        <p className="text-emerald-100 max-w-2xl mx-auto">{t.bookingSubtitle}</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {isAdmin && viewMode === 'week' ? (
           <>
             <div className="mb-6 flex justify-end">
               <button 
                 onClick={() => setViewMode('day')} 
                 className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-bold transition-colors"
               >
                 <List size={14}/> {t.dayView}
               </button>
             </div>
             {renderWeekView()}
           </>
        ) : renderDailyView()}
      </div>
    </div>
  );

  const getServiceIcon = (index) => {
    if (index % 4 === 0) return <Leaf size={32} />;
    if (index % 4 === 1) return <Activity size={32} />;
    if (index % 4 === 2) return <Heart size={32} />;
    return <Star size={32} />;
  };

  const renderServices = () => (
    <div className="animate-in fade-in duration-500 py-16 px-6">
      <SectionHeader title={t.servicesPage.title} subtitle={t.servicesPage.subtitle} />
      <div className="max-w-4xl mx-auto grid gap-8">
        {t.servicesPage.list.map((s, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-6 items-start bg-white p-6 border-b border-stone-100 last:border-0">
             <div className="w-16 h-16 bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0 rounded-sm">
                {getServiceIcon(i)}
             </div>
             <div>
               <h3 className="text-xl font-serif font-bold text-emerald-900 mb-2">{s.title}</h3>
               <p className="text-stone-600 leading-relaxed">{s.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in duration-500 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title={t.aboutPage.title} />
        <div className="flex flex-col md:flex-row gap-12 items-center">
           <div className="md:w-1/2">
              <div className="aspect-square bg-stone-200 relative overflow-hidden">
                 <div className="absolute inset-0 bg-emerald-900/10"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-emerald-900/20">
                    <MapPin size={64} />
                 </div>
              </div>
           </div>
           <div className="md:w-1/2 space-y-6 text-stone-600 text-lg leading-relaxed">
             <p>{t.aboutPage.p1}</p>
             <p>{t.aboutPage.p2}</p>
             <div className="flex gap-6 mt-8 pt-8 border-t border-stone-200">
               {t.aboutPage.stats.map((stat, i) => (
                 <div key={i}>
                   <div className="text-2xl font-bold text-emerald-800 font-serif">{stat}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="animate-in fade-in duration-500">
      <div className="relative bg-stone-100 h-[500px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80"></div>
         <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
           <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight tracking-wide">
             {t.heroTitle}
           </h1>
           <p className="text-emerald-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light leading-relaxed">
             {t.heroSubtitle}
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button onClick={() => setCurrentPage('appointments')} className="bg-white text-emerald-900 px-8 py-4 rounded-sm font-semibold tracking-widest hover:bg-emerald-50 transition-all uppercase text-sm">
               {t.bookNow}
             </button>
             <button onClick={() => setCurrentPage('about')} className="border border-white text-white px-8 py-4 rounded-sm font-semibold tracking-widest hover:bg-white/10 transition-all uppercase text-sm">
               {t.learnMore}
             </button>
           </div>
         </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-6">{t.welcomeTitle}</h2>
        <div className="h-0.5 w-20 bg-emerald-600 mx-auto mb-8"></div>
        <p className="text-stone-600 text-lg leading-loose">{t.welcomeText}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:gap-4 gap-1">
             <span className="flex items-center gap-1"><Phone size={12}/> 508-628-1888</span>
             <span className="flex items-center gap-1"><Printer size={12}/> Fax: 508-628-1889</span>
             <span className="hidden sm:flex items-center gap-1"><MapPin size={12}/> 655 Concord St, Framingham 01702</span>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="hover:text-white transition-colors">
               {lang === 'en' ? '中文' : 'English'}
             </button>
             {isAdmin && (
               <button onClick={() => setIsSettingsOpen(true)} className="hover:text-white transition-colors"><Settings size={14}/></button>
             )}
             {!isAdmin ? (
               <button onClick={() => setIsAdminLoginOpen(true)} className="hover:text-white transition-colors">{t.login}</button>
             ) : (
               <button onClick={() => setIsAdmin(false)} className="text-red-300 hover:text-red-200">{t.logout}</button>
             )}
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-900 flex items-center justify-center text-white">
              <span className="font-serif italic font-bold text-2xl">W</span>
            </div>
            <div className="text-left">
              <h1 className="font-serif font-bold text-xl md:text-2xl text-emerald-950 tracking-tight">
                {t.title}
              </h1>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {['home', 'services', 'about', 'appointments'].map(page => (
               <button 
                 key={page}
                 onClick={() => setCurrentPage(page)} 
                 className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-emerald-800 ${
                   currentPage === page ? 'text-emerald-800 border-b-2 border-emerald-800' : 'text-stone-500'
                 }`}
               >
                 {t.menu[page]}
               </button>
            ))}
            {!isAdmin && (
               <button onClick={openCancelModal} className="text-stone-400 hover:text-emerald-800">
                 <Search size={18} />
               </button>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-stone-600 p-1">
             {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-stone-50 border-t border-stone-200 p-6 space-y-4">
            {['home', 'services', 'about', 'appointments'].map(page => (
              <button 
                key={page}
                onClick={() => { setCurrentPage(page); setIsMobileMenuOpen(false); }} 
                className="block w-full text-left font-bold text-emerald-900 uppercase tracking-widest"
              >
                {t.menu[page]}
              </button>
            ))}
            <button onClick={() => { openCancelModal(); setIsMobileMenuOpen(false); }} className="block w-full text-left font-bold text-stone-500 uppercase tracking-widest text-sm pt-4 border-t border-stone-200">
              {t.myBookings}
            </button>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'services' && renderServices()}
        {currentPage === 'appointments' && renderAppointments()}
        {currentPage === 'testimonials' && (
           <div className="animate-in fade-in duration-500 py-16 px-6">
             <SectionHeader title={t.testimonialsPage.title} />
             <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
               {t.testimonialsPage.list.map((item, i) => (
                 <div key={i} className="bg-stone-50 p-8 border border-stone-100">
                   <div className="text-emerald-800 mb-4 flex"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                   <p className="text-stone-700 italic mb-4 font-serif text-lg">"{item.text}"</p>
                   <div className="font-bold text-emerald-900 uppercase tracking-wide text-sm">- {item.name}</div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
           <div>
             <h4 className="text-white font-serif font-bold text-lg mb-4">{t.title}</h4>
             <p className="mb-4">Integrative wellness solutions for modern life.</p>
             <p>{t.footer}</p>
           </div>
           <div>
             <h4 className="text-white font-bold uppercase tracking-widest mb-4">Contact</h4>
             <p>655 Concord Street, Framingham 01702</p>
             <p>508-628-1888</p>
             <p>Fax: 508-628-1889</p>
           </div>
           <div>
             <h4 className="text-white font-bold uppercase tracking-widest mb-4">Hours</h4>
             <p>Mon - Fri: 9:00 AM - 4:00 PM</p>
             <p>Sat: 9:00 AM - 3:00 PM</p>
             <p>Sun: Closed</p>
           </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title={`${t.bookSlot}: ${selectedSlot}`}>
        <form onSubmit={submitBooking} className="space-y-5">
          <div className="p-4 bg-stone-50 text-stone-600 text-sm border-l-4 border-emerald-600">
             <p>{t.enterDetails}</p>
             <p className="mt-1 font-bold text-red-500 text-xs">{t.requiredFields}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.firstName} *</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder={lang === 'en' ? "Jane" : "大文"} />
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.lastName} *</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder={lang === 'en' ? "Doe" : "陳"} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.phone} *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder="555-123-4567" />
          </div>
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.email} *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none transition-colors" placeholder="jane@example.com" />
          </div>
          {formError && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 flex items-center gap-2"><XCircle size={16}/> {formError}</div>}
          <div className="flex gap-4 pt-2">
            <button 
              type="submit" 
              disabled={!(firstName.trim() && lastName.trim() && phone.trim() && email.trim())}
              className={`flex-1 py-3 font-bold uppercase tracking-widest transition-colors shadow-lg ${
                (firstName.trim() && lastName.trim() && phone.trim() && email.trim())
                  ? 'bg-emerald-900 text-white hover:bg-emerald-800'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              {t.confirm}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title={t.findBooking}>
        <div className="space-y-5">
          <p className="text-sm text-stone-500">{t.enterPhoneToFind}</p>
          <form onSubmit={handleSearchBookings} className="flex gap-2">
            <input type="tel" value={cancelPhone} onChange={(e) => setCancelPhone(e.target.value)} className="flex-1 px-4 py-3 border border-stone-200 bg-stone-50 focus:border-emerald-500 outline-none" placeholder={t.phone} required />
            <button type="submit" className="px-6 py-3 bg-stone-800 text-white font-bold uppercase tracking-widest hover:bg-stone-900 transition-colors">{t.search}</button>
          </form>
          {hasSearched && (
            <div className="mt-4 animate-in fade-in">
              {foundBookings.length === 0 ? (
                <div className="text-center py-8 text-stone-400 border border-stone-100 bg-stone-50"><p>{t.noBookings}</p></div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {foundBookings.map(app => (
                    <div key={app.id} className="bg-white border border-stone-200 p-4 flex justify-between items-center group shadow-sm hover:border-emerald-200 transition-colors">
                       <div><div className="font-bold text-emerald-900 font-serif text-lg">{app.date}</div><div className="text-sm text-stone-500">{app.hour} - {app.name}</div></div>
                       <button onClick={() => handleDeleteBooking(app.id, t.confirmCancel)} className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 font-bold uppercase tracking-wider transition-colors">{t.cancel}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Admin Login Modal */}
      <Modal isOpen={isAdminLoginOpen} onClose={() => { setIsAdminLoginOpen(false); setFormError(''); }} title={t.adminMode}>
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div className="text-center mb-4">
             <div className="inline-block p-3 bg-stone-100 rounded-full mb-2"><Lock size={24} className="text-stone-400"/></div>
             <p className="text-sm text-stone-500">Authorized personnel only.</p>
          </div>
          <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none text-center tracking-widest" placeholder="• • • •" autoFocus />
          {formError && <div className="text-red-600 text-sm font-medium text-center">{formError}</div>}
          <button type="submit" className="w-full py-3 bg-stone-800 text-white font-bold uppercase tracking-widest hover:bg-stone-900 transition-colors">{t.login}</button>
        </form>
      </Modal>

      {/* Admin Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title={t.settings}>
        <form onSubmit={saveSettings} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.daysAheadLabel}</label>
            <input 
              type="number" 
              value={settings.bookingWindowWeeks || ''} 
              onChange={(e) => setSettings({...settings, bookingWindowWeeks: e.target.value})} 
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none" 
              placeholder="e.g. 4"
            />
            <p className="text-xs text-stone-500 mt-2">{t.daysAheadDesc}</p>
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-900 text-white font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shadow-lg">{t.save}</button>
        </form>
      </Modal>

      {/* Admin Block Range Modal */}
      <Modal isOpen={isBlockRangeOpen} onClose={() => setIsBlockRangeOpen(false)} title={t.blockRangeTitle}>
        <form onSubmit={handleRangeBlockSubmit} className="space-y-5">
          <div className="p-3 bg-red-50 text-red-700 text-xs border-l-4 border-red-500 rounded">
             <p>This will block all slots between the selected times for <strong>{selectedDate}</strong>.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.startTime}</label>
              <select 
                value={blockStartTime} 
                onChange={(e) => setBlockStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none"
              >
                {/* Dynamically get slots for current date to populate dropdown */}
                {getDailySlots(selectedDate).length > 0 
                  ? getDailySlots(selectedDate).map(t => <option key={t} value={t}>{t}</option>)
                  : <option disabled>No slots</option>
                }
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-widest mb-2">{t.endTime}</label>
              <select 
                value={blockEndTime} 
                onChange={(e) => setBlockEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-emerald-500 outline-none"
              >
                {getDailySlots(selectedDate).length > 0 
                  ? getDailySlots(selectedDate).map(t => <option key={t} value={t}>{t}</option>)
                  : <option disabled>No slots</option>
                }
              </select>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-red-700 text-white font-bold uppercase tracking-widest hover:bg-red-800 transition-colors shadow-lg">{t.blockConfirm}</button>
        </form>
      </Modal>

      {/* Booking Details Modal (Week View) */}
      <Modal 
        isOpen={!!selectedBookingDetails} 
        onClose={() => setSelectedBookingDetails(null)} 
        title={t.apptDetails}
      >
        {selectedBookingDetails && (
          <div className="space-y-4">
             <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
               {/* Handles both new 'firstName' and legacy 'name' formats */}
               <p className="font-bold text-emerald-900 text-lg">{selectedBookingDetails.firstName ? `${selectedBookingDetails.firstName} ${selectedBookingDetails.lastName}` : selectedBookingDetails.name}</p>
               <p className="text-sm text-stone-600">{selectedBookingDetails.date} at {selectedBookingDetails.hour}</p>
             </div>
             <div className="space-y-2">
               <div className="flex items-center gap-3 text-stone-600">
                 <Phone size={16} />
                 <a href={`tel:${selectedBookingDetails.phone}`} className="hover:text-emerald-800 underline">{selectedBookingDetails.phone}</a>
               </div>
               <div className="flex items-center gap-3 text-stone-600">
                 <Mail size={16} />
                 <a href={`mailto:${selectedBookingDetails.email}`} className="hover:text-emerald-800 underline">{selectedBookingDetails.email}</a>
               </div>
             </div>
             <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button 
                  onClick={() => {
                    handleDeleteBooking(selectedBookingDetails.id, t.confirmCancel);
                    setSelectedBookingDetails(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-bold"
                >
                  <Trash2 size={16}/> Cancel Appointment
                </button>
             </div>
          </div>
        )}
      </Modal>

    </div>
  );
}