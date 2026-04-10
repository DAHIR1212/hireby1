import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Plus, Home, Briefcase, Trash2, Loader2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function ManageAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    houseNo: '',
    street: '',
    road: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  const phone = localStorage.getItem('userPhone') || '';
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  useEffect(() => {
    if (!cleanPhone) { setLoading(false); return; }
    const q = query(collection(db, 'users', cleanPhone, 'addresses'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setAddresses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [cleanPhone]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${formData.houseNo}, ${formData.street}, ${formData.road}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
    
    setAdding(true);
    try {
      await addDoc(collection(db, 'users', cleanPhone, 'addresses'), {
        type: formData.type,
        address: fullAddress,
        details: formData, // Store parts individually too
        isDefault: addresses.length === 0,
      });
      setShowForm(false);
      setFormData({ houseNo: '', street: '', road: '', city: '', state: '', pincode: '', type: 'Home' });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteDoc(doc(db, 'users', cleanPhone, 'addresses', id));
    } catch (err) {
      console.error(err);
    }
  };

  const setAsDefault = async (id: string) => {
    for (const a of addresses) {
      await updateDoc(doc(db, 'users', cleanPhone, 'addresses', a.id), {
        isDefault: a.id === id
      });
    }
    const current = addresses.find(a => a.id === id);
    if (current) {
        await updateDoc(doc(db, 'users', cleanPhone), { location: current.address });
        localStorage.setItem('userLocation', current.address);
    }
  };

  if (loading) {
    return <div className="size-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-6 py-6 flex items-center gap-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={() => showForm ? setShowForm(false) : navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="font-black text-xl text-gray-900 uppercase tracking-tighter italic">Manage Addresses</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showForm ? (
          <form onSubmit={handleSave} className="p-6 space-y-5 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-blue-50 p-4 rounded-[24px] border border-blue-100 mb-6">
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 italic">Mission Protocol</p>
               <h3 className="text-gray-900 font-bold leading-tight">Add a precise location for efficient mission execution.</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <div className="col-span-1">
                 <label className="mb-2 block">House / Flat No.</label>
                 <input
                   required
                   value={formData.houseNo}
                   onChange={e => setFormData({...formData, houseNo: e.target.value})}
                   className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                   placeholder="101, Galaxy Apt"
                 />
               </div>
               <div className="col-span-1">
                 <label className="mb-2 block">Address Type</label>
                 <select
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value})}
                   className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                 >
                   <option>Home</option>
                   <option>Work</option>
                   <option>Other</option>
                 </select>
               </div>
            </div>

            <div className="space-y-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <div>
                  <label className="mb-2 block">Street / Colony</label>
                  <input
                    required
                    value={formData.street}
                    onChange={e => setFormData({...formData, street: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                    placeholder="Near City Mall"
                  />
               </div>
               <div>
                  <label className="mb-2 block">Road Name</label>
                  <input
                    required
                    value={formData.road}
                    onChange={e => setFormData({...formData, road: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                    placeholder="Main MG Road"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
               <div>
                  <label className="mb-2 block">City</label>
                  <input
                    required
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                    placeholder="Mumbai"
                  />
               </div>
               <div>
                  <label className="mb-2 block">State</label>
                  <input
                    required
                    value={formData.state}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                    placeholder="Maharashtra"
                  />
               </div>
            </div>

            <div>
               <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">Pincode</label>
               <input
                 required
                 type="tel"
                 maxLength={6}
                 value={formData.pincode}
                 onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})}
                 className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 font-bold"
                 placeholder="400001"
               />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Abort
              </button>
              <button
                type="submit"
                disabled={adding}
                className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-gray-200"
              >
                {adding ? 'Syncing...' : 'Save Station'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <button
              onClick={() => setShowForm(true)}
              className="w-full mb-8 py-5 border-2 border-dashed border-gray-200 rounded-[32px] flex items-center justify-center gap-3 text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-all hover:bg-blue-50/50 group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              <span className="font-black uppercase tracking-[0.2em] text-xs">Deploy New Station</span>
            </button>

            <div className="space-y-6">
              {addresses.map((addr) => {
                const Icon = addr.type === 'Home' ? Home : (addr.type === 'Work' ? Briefcase : MapPin);
                return (
                  <div
                    key={addr.id}
                    className={`bg-white border p-6 rounded-[32px] transition-all relative overflow-hidden group ${addr.isDefault ? 'border-blue-600 shadow-2xl shadow-blue-50' : 'border-gray-100'}`}
                  >
                    {addr.isDefault && <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 -mr-12 -mt-12 rounded-full" />}
                    
                    <div className="flex items-start gap-5 mb-5">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${addr.isDefault ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-gray-50 text-gray-300'}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-black uppercase tracking-tighter text-xl italic ${addr.isDefault ? 'text-gray-900' : 'text-gray-400'}`}>{addr.type} ADDRESS</h3>
                          {addr.isDefault && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full">
                               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                               <span className="text-[9px] font-black uppercase tracking-widest">CURRENT STATION</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          {addr.details ? (
                            <>
                              <p className="text-xs font-bold text-gray-900 leading-tight">
                                {addr.details.houseNo}, {addr.details.street}
                              </p>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {addr.details.road}, {addr.details.city}
                              </p>
                              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                {addr.details.state} - {addr.details.pincode}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm font-bold text-gray-500 leading-tight pr-4">{addr.address}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setAsDefault(addr.id)}
                          className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors"
                        >
                          Use This Address
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className={`py-4 px-6 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors ${addr.isDefault ? 'flex-1' : ''}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {addresses.length === 0 && !loading && (
                <div className="py-20 text-center opacity-20">
                   <MapPin className="w-20 h-20 mx-auto mb-4" />
                   <p className="font-black uppercase tracking-widest">No Active Stations</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
