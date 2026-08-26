import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Clock, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { setSingleCompany } from '@/redux/companySlice'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const [verificationInput, setVerificationInput] = useState({
        businessEmail: "",
        registrationNumber: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const verificationChangeHandler = (e) => {
        setVerificationInput({ ...verificationInput, [e.target.name]: e.target.value });
    }

    const verificationFileHandler = (e) => {
        const file = e.target.files?.[0];
        setVerificationInput({ ...verificationInput, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const submitVerificationHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("businessEmail", verificationInput.businessEmail);
        formData.append("registrationNumber", verificationInput.registrationNumber);
        if (verificationInput.file) {
            formData.append("file", verificationInput.file);
        }

        try {
            setVerificationLoading(true);
            const res = await axios.post(`${COMPANY_API_END_POINT}/verify/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setSingleCompany(res.data.company));
                setVerificationInput({
                    businessEmail: res.data.company?.verification?.businessEmail || "",
                    registrationNumber: res.data.company?.verification?.registrationNumber || "",
                    file: null
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Unable to submit verification.");
        } finally {
            setVerificationLoading(false);
        }
    }

    const verificationStatus = singleCompany?.verificationStatus || "unsubmitted";
    const verificationBadge = {
        verified: {
            label: "Verified",
            icon: ShieldCheck,
            className: "border-emerald-200 bg-emerald-50 text-emerald-700"
        },
        pending: {
            label: "Pending review",
            icon: Clock,
            className: "border-amber-200 bg-amber-50 text-amber-700"
        },
        rejected: {
            label: "Rejected",
            icon: ShieldAlert,
            className: "border-red-200 bg-red-50 text-red-700"
        },
        unsubmitted: {
            label: "Not submitted",
            icon: ShieldAlert,
            className: "border-gray-200 bg-gray-50 text-gray-700"
        }
    }[verificationStatus];
    const VerificationIcon = verificationBadge.icon;

    useEffect(() => {
        setInput({
            name: singleCompany?.name || "",
            description: singleCompany?.description || "",
            website: singleCompany?.website || "",
            location: singleCompany?.location || "",
            file: null
        });
        setVerificationInput({
            businessEmail: singleCompany?.verification?.businessEmail || "",
            registrationNumber: singleCompany?.verification?.registrationNumber || "",
            file: null
        })
    },[singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <div className='flex items-center gap-3'>
                            <h1 className='font-bold text-xl'>Company Setup</h1>
                            <Badge variant="outline" className={`gap-1 rounded-full ${verificationBadge.className}`}>
                                <VerificationIcon className='h-4 w-4' />
                                {verificationBadge.label}
                            </Badge>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 px-8 pb-6'>
                        <Avatar className='h-16 w-16'>
                            <AvatarImage src={singleCompany?.logo} alt={singleCompany?.name} />
                            <AvatarFallback className='bg-[#6A38C2] text-white font-semibold'>
                                {singleCompany?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className='font-semibold'>{singleCompany?.name || 'Company Logo'}</h2>
                            <p className='text-sm text-gray-500'>Upload or replace your company logo here.</p>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                name="file"
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                </form>
                <form onSubmit={submitVerificationHandler} className='mt-8 border-t pt-8'>
                    <div className='mb-5 flex items-start justify-between gap-4'>
                        <div>
                            <h2 className='font-bold text-lg'>Company Verification</h2>
                            <p className='text-sm text-gray-500'>Submit official company proof to build trust with applicants.</p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 gap-1 rounded-full ${verificationBadge.className}`}>
                            <VerificationIcon className='h-4 w-4' />
                            {verificationBadge.label}
                        </Badge>
                    </div>
                    {singleCompany?.verification?.rejectionReason && (
                        <p className='mb-4 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700'>
                            {singleCompany.verification.rejectionReason}
                        </p>
                    )}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Business Email</Label>
                            <Input
                                type="email"
                                name="businessEmail"
                                value={verificationInput.businessEmail}
                                onChange={verificationChangeHandler}
                                placeholder="hr@company.com"
                            />
                        </div>
                        <div>
                            <Label>Registration Number</Label>
                            <Input
                                type="text"
                                name="registrationNumber"
                                value={verificationInput.registrationNumber}
                                onChange={verificationChangeHandler}
                            />
                        </div>
                        <div className='col-span-2'>
                            <Label>Verification Document</Label>
                            <Input
                                name="file"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={verificationFileHandler}
                            />
                            {singleCompany?.verification?.documentOriginalName && (
                                <p className='mt-2 text-sm text-gray-500'>Current document: {singleCompany.verification.documentOriginalName}</p>
                            )}
                        </div>
                    </div>
                    {
                        verificationLoading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Submitting </Button> : <Button type="submit" className="w-full my-4 bg-emerald-600 hover:bg-emerald-700">Submit Verification</Button>
                    }
                </form>
            </div>

        </div>
    )
}

export default CompanySetup
