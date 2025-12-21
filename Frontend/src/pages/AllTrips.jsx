import React, { useEffect, useState } from 'react'
import { useTrip } from '../context/TripContext'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Truck, AlertCircle, CheckCircle, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const AllTrips = () => {
    const navigate = useNavigate();
    const { trips, fetchTrips, deleteTrip, loading } = useTrip();
    const { user, logOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTrips();
    }, []);

    const handleLogout = async () => {
        await logOut();
        navigate('/login');
    };

    const handleDelete = async (tripId) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            const result = await deleteTrip(tripId);
            if (result.success) {
                toast.success('Trip deleted successfully!');
            } else {
                toast.error(result.message || 'Failed to delete trip');
            }
        }
    };

    const filteredTrips = trips.filter(trip => {
        const matchesStatus = filterStatus === 'All' || trip.paymentStatus === filterStatus;
        const matchesSearch = 
            trip.Vehicle_Number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.route?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trip.monthAndYear?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) {
        return (
            <div className='min-h-screen bg-stone-100 flex items-center justify-center'>
                <div className='border-8 border-black bg-yellow-400 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    <p className='text-2xl font-black uppercase tracking-tight animate-pulse'>
                        Loading Trips...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-stone-100 p-4 md:p-8'>
            
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className='bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className='text-3xl md:text-5xl font-black uppercase tracking-tight border-b-4 border-black inline-block pb-2 bg-yellow-400 px-4 transform -rotate-1'>
                            All Trips
                        </h1>
                        <p className='mt-3 font-bold uppercase text-sm tracking-tight'>
                            Total: {filteredTrips.length} Trips
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-4 w-full md:w-auto justify-end'>
                    <Link to='/add-trip'>
                        <button className='bg-yellow-400 text-black font-black text-sm md:text-base uppercase py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'>
                            + Add Trip
                        </button>
                    </Link>

                    <div className='relative'>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className='bg-white border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
                        >
                            <User size={24} />
                        </button>

                        {showUserMenu && (
                            <div className='absolute right-0 mt-2 w-48 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50'>
                                <div className='p-4 border-b-4 border-black'>
                                    <p className='font-black uppercase text-sm truncate'>{user?.name}</p>
                                    <p className='text-xs font-bold text-gray-600 truncate'>{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='w-full flex items-center gap-2 p-3 font-black uppercase text-sm hover:bg-yellow-400 transition-colors'
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
            <div className='mb-6 flex flex-col md:flex-row gap-4'>
                <input
                    type='text'
                    placeholder='Search by vehicle, route, or month...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='flex-1 px-4 py-3 border-4 border-black font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white'
                />

                <div className='flex gap-2'>
                    {['All', 'Pending', 'Cleared'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-3 border-4 border-black font-black text-sm uppercase transition-all ${
                                filterStatus === status
                                    ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                    : 'bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            
            {filteredTrips.length === 0 ? (
                <div className='border-8 border-black bg-white p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
                    <Truck size={64} className='mx-auto mb-4' />
                    <h3 className='text-2xl font-black uppercase mb-2'>No Trips Found</h3>
                    <p className='font-bold text-gray-600 mb-6'>Start by adding your first trip!</p>
                    <Link to='/add-trip'>
                        <button className='bg-yellow-400 text-black font-black text-lg uppercase py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'>
                            Add Trip
                        </button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 gap-6'>
                    {filteredTrips.map((trip) => (
                        <div
                            key={trip._id}
                            className='border-8 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all'
                        >
                            <div className='flex flex-col md:flex-row justify-between gap-4'>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='bg-yellow-400 border-4 border-black p-3'>
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <h3 className='text-xl md:text-2xl font-black uppercase'>
                                                {trip.Vehicle_Number}
                                            </h3>
                                            <p className='font-bold text-gray-600 uppercase text-sm'>
                                                {trip.route}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                                        <div className='border-4 border-black p-3 bg-stone-50'>
                                            <p className='text-xs font-black uppercase text-gray-600 mb-1'>Month</p>
                                            <p className='font-black text-sm'>{trip.monthAndYear}</p>
                                        </div>
                                        <div className='border-4 border-black p-3 bg-stone-50'>
                                            <p className='text-xs font-black uppercase text-gray-600 mb-1'>Income</p>
                                            <p className='font-black text-sm text-green-600'>₹{trip.totalIncome?.toLocaleString()}</p>
                                        </div>
                                        <div className='border-4 border-black p-3 bg-stone-50'>
                                            <p className='text-xs font-black uppercase text-gray-600 mb-1'>Profit</p>
                                            <p className='font-black text-sm text-blue-600'>₹{trip.netProfit?.toLocaleString()}</p>
                                        </div>
                                        <div className='border-4 border-black p-3 bg-stone-50'>
                                            <p className='text-xs font-black uppercase text-gray-600 mb-1'>Status</p>
                                            <div className='flex items-center gap-1'>
                                                {trip.paymentStatus === 'Cleared' ? (
                                                    <CheckCircle size={14} className='text-green-600' />
                                                ) : (
                                                    <AlertCircle size={14} className='text-orange-600' />
                                                )}
                                                <p className={`font-black text-sm ${
                                                    trip.paymentStatus === 'Cleared' ? 'text-green-600' : 'text-orange-600'
                                                }`}>
                                                    {trip.paymentStatus}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex md:flex-col gap-2 justify-end'>
                                    <Link to={`/trip/${trip._id}`}>
                                        <button className='bg-blue-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'>
                                            <Eye size={20} />
                                        </button>
                                    </Link>
                                    <Link to={`/edit/${trip._id}`}>
                                        <button className='bg-yellow-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'>
                                            <Edit size={20} />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(trip._id)}
                                        className='bg-red-400 border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AllTrips
