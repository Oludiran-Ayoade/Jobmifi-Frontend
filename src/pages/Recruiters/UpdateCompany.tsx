import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Toast } from 'primereact/toast';

type FormValues = {
    name: string;
    coverImage: FileList | null;
    about: string;
    founded: string;
    logo: FileList | null;
    size: number;
    pictures: FileList | null;
    category: string;
    location: string;
};

const UpdateCompanyForm: React.FC = () => {
    const toast = useRef<Toast>(null);
    const { register, handleSubmit, setValue } = useForm<FormValues>();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { user, token } = auth;
    const userId = user?._id || '';

    const [loading, setLoading] = useState(false);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [picturesPreview, setPicturesPreview] = useState<string[]>([]);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`https://jobmifi-backend.onrender.com/api/users/getcompanyid/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const companyData = response.data.data;
                setValue('name', companyData.name);
                setValue('about', companyData.about);
                setValue('founded', companyData.founded.split('T')[0]);
                setValue('size', companyData.size);
                setValue('category', companyData.category);
                setValue('location', companyData.location);
                setCoverImagePreview(companyData.coverImage);
                setLogoPreview(companyData.logo);
                setPicturesPreview(companyData.pictures || []);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch company data', life: 3000 });
                // console.error('Failed to fetch company data:', error);
            }
        };

        fetchCompany();
    }, [id, token, setValue]);

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>, setImagePreview: React.Dispatch<React.SetStateAction<string | null>>, field: keyof FormValues) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setImagePreview(base64);
            setValue(field, e.target.files);
        } else {
            setImagePreview(null);
            setValue(field, null);
        }
    };

    const onMultipleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const previews = await Promise.all(Array.from(files).map(async (file) => {
                const base64 = await convertToBase64(file);
                return base64;
            }));
            setPicturesPreview(previews);
            setValue('pictures', files);
        } else {
            setPicturesPreview([]);
            setValue('pictures', null);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);

        try {
            const formData: any = {
                name: data.name,
                about: data.about,
                founded: data.founded,
                size: data.size,
                category: data.category,
                location: data.location,
                userId,
            };

            if (data.coverImage && data.coverImage.length > 0) {
                formData.coverImage = await convertToBase64(data.coverImage[0]);
            }

            if (data.logo && data.logo.length > 0) {
                formData.logo = await convertToBase64(data.logo[0]);
            }

            if (data.pictures && data.pictures.length > 0) {
                formData.pictures = await Promise.all(Array.from(data.pictures).map(file => convertToBase64(file)));
            }

            await axios.patch(`https://jobmifi-backend.onrender.com/api/users/update/companies/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Company updated successfully', life: 2000 });
            navigate('/recruiter/manage-company');
            
        } catch (error) {
            // console.error('Error updating company:', error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update company', life: 3000 });
            // alert('Failed to update company');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Toast ref={toast}  className="custom-toast"/>
        <div className='add_company'>
            <div>
                <h3>Update Company</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Company Name</label><br />
                    <input type="text" {...register('name')}  style={{ width: '500px' }} placeholder='Enter Company Name' required />
                </div>
                <div className='d-flex mt-3'>
                    <div>
                        <label>Cover Image</label><br />
                        <div className="image-upload-box">
                            {coverImagePreview && <img src={coverImagePreview} alt="Cover Preview" />}
                            <span className="plus">+</span>
                            <input type="file" {...register('coverImage')} onChange={(e) => onImageChange(e, setCoverImagePreview, 'coverImage')} />
                        </div>
                    </div>
                    <div>
                        <label>Logo</label><br />
                        <div className="image-upload-box">
                            {logoPreview && <img src={logoPreview} alt="Logo Preview" />}
                            <span className="plus">+</span>
                            <input type="file" {...register('logo')} onChange={(e) => onImageChange(e, setLogoPreview, 'logo')} />
                        </div>
                    </div>
                </div>
                
                <div>
                    <label>About Company</label><br />
                    <textarea {...register('about')} required />
                </div>
                <div>
                    <label>Founded</label><br />
                    <input type="date" {...register('founded')} required />
                </div>
                
                <div>
                    <label>Company Size</label><br />
                    <input type="number" {...register('size')}  style={{ width: '500px' }} required />
                </div>
                <div className='second_section'>
                    <div>
                        <label>Company Pictures</label><br />
                        <div className="image-upload-container">
                            {picturesPreview.map((picture, index) => (
                                <div key={index} className="image-upload-box">
                                    <img src={picture} alt={`Preview ${index + 1}`} />
                                    <span className="plus">+</span>
                                </div>
                            ))}
                            <div className="image-upload-box">
                                <span className="plus">+</span>
                                <input type="file" multiple {...register('pictures')} onChange={onMultipleImagesChange} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label>Industry Category</label><br />
                        <select {...register('category')} required>
                            <option value="Business development">Business development</option>
                            <option value="construction">Construction</option>
                            <option value="customer service">Customer Service</option>
                            <option value="finance">Finance</option>
                            <option value="health care">Health Care</option>
                            <option value="human resources">Human Resources</option>
                            <option value="marketing and communication">Marketing and Communication</option>
                            <option value="software development">Software Development</option>
                            <option value="project management">Project Management</option>
                        </select>
                    </div>
                    <div>
                        <label>Location</label><br />
                        <select {...register('location')} required>
                            <option value="lagos">Lagos</option>
                            <option value="cairo">Cairo</option>
                            <option value="london">London</option>
                            <option value="america">America</option>
                            <option value="china">China</option>
                            <option value="oslo">Oslo</option>
                            <option value="berlin">Berlin</option>
                            <option value="canada">Canada</option>
                            <option value="ireland">Ireland</option>
                            <option value="germany">Germany</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Company'}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default UpdateCompanyForm;
