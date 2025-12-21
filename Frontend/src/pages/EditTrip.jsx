import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTrip } from '../context/TripContext'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-toastify'

const EditTrip = () => {
  const { id } = useParams() 
  const navigate = useNavigate()
  const { trips, updateTrips, uploadReceipts, deleteReceipt, getReceipts, fetchSingleTrip, loading } = useTrip()
  
  const [formData, setFormData] = useState({
    Vehicle_Number: '',
    route: '',
    monthAndYear: '',
    totalIncome: '',
    fuelCost: '',
    driverAllowance: {
      totalSalary: 7000,
      bonus: 0,
      paid: 0
    },
    hamaali: '',
    paidTransport: '',
    maintenanceCost: '',
    otherExpenses: '',
    commission: '',
    pendingAmount: '',
    phonePai: '',
    paymentStatus: 'Pending',
  })

  const [receiptFiles, setReceiptFiles] = useState([])
  const [receiptPreviews, setReceiptPreviews] = useState([])
  const [existingReceipts, setExistingReceipts] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadTripData()
  }, [id])

  const loadTripData = async () => {
    let trip = trips.find(t => t._id === id)
    
    if (!trip) {
      const result = await fetchSingleTrip(id)
      if (result.success) {
        trip = result.trip
      } else {
        setError('Trip not found')
        return
      }
    }

    if (trip) {
      setFormData({
        Vehicle_Number: trip.Vehicle_Number || '',
        route: trip.route || '',
        monthAndYear: trip.monthAndYear || '',
        totalIncome: trip.totalIncome || '',
        fuelCost: trip.fuelCost || '',
        driverAllowance: trip.driverAllowance || {
          totalSalary: 7000,
          bonus: 0,
          paid: 0
        },
        hamaali: trip.hamaali || '',
        paidTransport: trip.paidTransport || '',
        maintenanceCost: trip.maintenanceCost || '',
        otherExpenses: trip.otherExpenses || '',
        commission: trip.commission || '',
        pendingAmount: trip.pendingAmount || '',
        phonePai: trip.phonePai || '',
        paymentStatus: trip.paymentStatus || 'Pending',
      })
      
      loadReceipts()
    }
  }

  const loadReceipts = async () => {
    const result = await getReceipts(id)
    if (result.success) {
      setExistingReceipts(result.receipts || [])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('driverAllowance.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        driverAllowance: {
          ...formData.driverAllowance,
          [field]: value === '' ? '' : Number(value)
        }
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit`)
        return false
      }
      return true
    })

    if (validFiles.length + receiptFiles.length + existingReceipts.length > 5) {
      setError('Maximum 5 receipts allowed')
      return
    }

    setReceiptFiles([...receiptFiles, ...validFiles])
    
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveNewReceipt = (index) => {
    setReceiptFiles(receiptFiles.filter((_, i) => i !== index))
    setReceiptPreviews(receiptPreviews.filter((_, i) => i !== index))
  }

  const handleDeleteExistingReceipt = async (receiptId) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      const result = await deleteReceipt(id, receiptId)
      if (result.success) {
        setExistingReceipts(existingReceipts.filter(r => r._id !== receiptId))
        setSuccess('Receipt deleted successfully')
        toast.success("Receipt deleted successfully!");
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.message || 'Failed to delete receipt')
        toast.error(result.message || 'Failed to delete receipt');
      }
    }
  }

  const handleUploadNewReceipts = async () => {
    if (receiptFiles.length === 0) return

    let successCount = 0
    let failCount = 0
    
    for (const file of receiptFiles) {
      const uploadResult = await uploadReceipts(id, file)
      if (uploadResult.success) {
        successCount++
      } else {
        failCount++
      }
    }
    
    if (successCount > 0) {
      setReceiptFiles([])
      setReceiptPreviews([])
      await loadReceipts()
    }
    
    if (failCount > 0) {
      setError(`${failCount} receipt(s) failed to upload`)
      toast.error(`${failCount} receipt(s) failed to upload`);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const sanitizedData = {
      ...formData,
      totalIncome: Number(formData.totalIncome) || 0,
      fuelCost: Number(formData.fuelCost) || 0,
      hamaali: Number(formData.hamaali) || 0,
      paidTransport: Number(formData.paidTransport) || 0,
      maintenanceCost: Number(formData.maintenanceCost) || 0,
      otherExpenses: Number(formData.otherExpenses) || 0,
      commission: Number(formData.commission) || 0,
      pendingAmount: Number(formData.pendingAmount) || 0,
      phonePai: Number(formData.phonePai) || 0,
    }

    try {
      const result = await updateTrips(id, sanitizedData)
      
      if (result.success) {
        if (receiptFiles.length > 0) {
          await handleUploadNewReceipts()
        }
        
        setSuccess('Trip updated successfully!')
        toast.success("Trip updated successfully!");
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        setError(result.message || 'Failed to update trip')
        toast.error(result.message || 'Failed to update trip');
      }
    } catch (error) {
      console.error('Update trip error:', error)
      setError('Failed to update trip')
      toast.error('Failed to update trip');
    }
  }

  return (
    <div className='min-h-screen bg-stone-100 p-4 md:p-8'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl md:text-5xl font-black uppercase tracking-tight border-b-4 border-black inline-block pb-2 bg-yellow-400 px-4 transform -rotate-1'>
            Edit Trip
          </h1>
          <button
            onClick={() => navigate('/dashboard')}
            className='bg-white border-4 border-black px-4 py-2 font-black uppercase text-sm hover:bg-yellow-400 transition-colors'
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-500 border-4 border-black text-white font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
            {error}
          </div>
        )}

        {success && (
          <div className='mb-6 p-4 bg-green-400 border-4 border-black text-black font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className='bg-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'>
          <div className='bg-yellow-400 border-b-4 border-black p-4'>
            <h2 className='text-xl md:text-2xl font-black uppercase'>
              📋 Basic Information
            </h2>
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Vehicle Number <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='Vehicle_Number'
                  value={formData.Vehicle_Number}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow uppercase'
                  placeholder='MH20B0000'
                  required
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Route <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='route'
                  value={formData.route}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='Route'
                  required
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Month & Year <span className='text-red-500'>*</span>
                </label>
                <input
                  type='month'
                  name='monthAndYear'
                  value={formData.monthAndYear}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  required
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Total Income <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  name='totalIncome'
                  value={formData.totalIncome}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                  required
                />
              </div>
            </div>
          </div>

          <div className='bg-red-400 border-t-4 border-b-4 border-black p-4'>
            <h2 className='text-xl md:text-2xl font-black uppercase'>
              💰 Expenses
            </h2>
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Fuel Cost
                </label>
                <input
                  type='number'
                  name='fuelCost'
                  value={formData.fuelCost}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Hamaali (Loading/Unloading)
                </label>
                <input
                  type='number'
                  name='hamaali'
                  value={formData.hamaali}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Paid Transport
                </label>
                <input
                  type='number'
                  name='paidTransport'
                  value={formData.paidTransport}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Maintenance Cost
                </label>
                <input
                  type='number'
                  name='maintenanceCost'
                  value={formData.maintenanceCost}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Commission
                </label>
                <input
                  type='number'
                  name='commission'
                  value={formData.commission}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Other Expenses
                </label>
                <input
                  type='number'
                  name='otherExpenses'
                  value={formData.otherExpenses}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>
            </div>
          </div>

          <div className='bg-green-400 border-t-4 border-b-4 border-black p-4'>
            <h2 className='text-xl md:text-2xl font-black uppercase'>
              👨‍✈️ Driver Allowance
            </h2>
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Total Salary
                </label>
                <input
                  type='number'
                  name='driverAllowance.totalSalary'
                  value={formData.driverAllowance.totalSalary}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='7000'
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Bonus
                </label>
                <input
                  type='number'
                  name='driverAllowance.bonus'
                  value={formData.driverAllowance.bonus}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Paid Amount
                </label>
                <input
                  type='number'
                  name='driverAllowance.paid'
                  value={formData.driverAllowance.paid}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>
            </div>

            <div className='bg-yellow-400 border-4 border-black p-4'>
              <p className='font-black uppercase text-sm'>
                Remaining Driver Payment: ₹
                {(formData.driverAllowance.totalSalary + formData.driverAllowance.bonus - formData.driverAllowance.paid).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className='bg-orange-400 border-t-4 border-b-4 border-black p-4'>
            <h2 className='text-xl md:text-2xl font-black uppercase'>
              📊 Payment Status
            </h2>
          </div>

          <div className='p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Pending Amount
                </label>
                <input
                  type='number'
                  name='pendingAmount'
                  value={formData.pendingAmount}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Payment Status
                </label>
                <select
                  name='paymentStatus'
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                >
                  <option value='Pending'>Pending</option>
                  <option value='Cleared'>Cleared</option>
                </select>
              </div>

              <div>
                <label className='block font-black uppercase text-sm mb-2 tracking-tight'>
                  Phone Pai
                </label>
                <input
                  type='number'
                  name='phonePai'
                  value={formData.phonePai}
                  onChange={handleChange}
                  className='w-full p-3 border-4 border-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow'
                  placeholder='0'
                />
              </div>
            </div>
          </div>

          <div className='bg-purple-400 border-t-4 border-b-4 border-black p-4'>
            <h2 className='text-xl md:text-2xl font-black uppercase'>
              📸 Payment Receipts
            </h2>
          </div>

          <div className='p-6 space-y-6'>
            {existingReceipts.length > 0 && (
              <div className='border-4 border-black p-4 bg-purple-50'>
                <h3 className='font-black uppercase text-sm mb-4'>
                  Existing Receipts ({existingReceipts.length}/5)
                </h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                  {existingReceipts.map((receipt) => (
                    <div key={receipt._id} className='relative border-4 border-black bg-white group'>
                      <img 
                        src={receipt.url} 
                        alt='Receipt' 
                        className='w-full h-24 object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => handleDeleteExistingReceipt(receipt._id)}
                        className='absolute -top-2 -right-2 bg-red-400 border-2 border-black p-1 hover:bg-black hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100'
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='border-4 border-black p-6 bg-purple-50'>
              <label className='font-black uppercase text-sm mb-4 flex items-center gap-2'>
                <Upload size={18} strokeWidth={3} />
                Upload New Receipts (Optional)
              </label>

              <div className='mb-4'>
                <label className='block'>
                  <div className='border-4 border-black p-6 text-center cursor-pointer hover:bg-yellow-400 transition-colors bg-white'>
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleFileChange}
                      className='hidden'
                      disabled={existingReceipts.length + receiptFiles.length >= 5}
                    />
                    <ImageIcon size={40} className='mx-auto mb-2' strokeWidth={2} />
                    <p className='font-bold uppercase text-sm'>
                      Click to upload receipts
                    </p>
                    <p className='text-xs font-bold text-gray-600 mt-1'>
                      JPG, PNG (Max 5MB each)
                    </p>
                  </div>
                </label>
              </div>

              {receiptPreviews.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                  {receiptPreviews.map((preview, index) => (
                    <div key={index} className='relative border-4 border-black bg-white'>
                      <button
                        type='button'
                        onClick={() => handleRemoveNewReceipt(index)}
                        className='absolute -top-2 -right-2 bg-red-400 border-2 border-black p-1 hover:bg-black hover:text-red-400 transition-colors z-10'
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className='w-full h-24 object-cover'
                      />
                    </div>
                  ))}
                </div>
              )}

              {receiptPreviews.length > 0 && (
                <p className='text-xs font-bold text-gray-600 mt-3'>
                  {receiptPreviews.length} new receipt(s) selected
                </p>
              )}
            </div>
          </div>

          <div className='border-t-4 border-black p-6 bg-stone-50'>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-black text-yellow-400 font-black text-xl md:text-2xl uppercase py-4 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Updating Trip...' : '✓ Update Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTrip
