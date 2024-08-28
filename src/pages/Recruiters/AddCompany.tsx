import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { Toast } from 'primereact/toast';

type FormValues = {
  name: string;
  coverImage: FileList;
  about: string;
  founded: string;
  logo: FileList;
  size: number;
  contactmail: string;
  pictures: FileList;
  category: string;
  location: string;
};

const CreateCompanyForm: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { register, handleSubmit, setValue, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const { user } = auth;
  const userId = user?._id || '';

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [picturesPreview, setPicturesPreview] = useState<string[]>([]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setImagePreview(base64);
    }
  };

  const onMultipleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) { 
      const previews = await Promise.all(Array.from(files).map(file => convertToBase64(file)));
      setPicturesPreview(previews);
      setValue('pictures', files);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const formData: any = {
        name: data.name,
        about: data.about,
        contactmail: data.contactmail,
        founded: data.founded,
        size: data.size,
        category: data.category,
        location: data.location,
        userId,
      };

      formData.coverImage = await convertToBase64(data.coverImage[0]);
      formData.logo = await convertToBase64(data.logo[0]);
      formData.pictures = await Promise.all(Array.from(picturesPreview));

      await axios.post('https://jobmifi-backend.onrender.com/api/users/addcompany', formData);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Company created successfully', life: 2000 });
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create company', life: 3000 });
    } finally {
      setLoading(false);

      // Clear form fields
      reset(); // Resets the form to its initial state

      // Clear image previews
      setCoverImagePreview(null);
      setLogoPreview(null);
      setPicturesPreview([]);
    }
  };

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <div className='add_company'>
        <div>
          <h3>Create a Company</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Company Name</label><br />
            <input type="text" {...register('name')} style={{ width: '500px' }} placeholder='Enter Company Name' required />
          </div>
          <div className='d-flex mt-3'>
            <div>
              <label>Cover Image</label><br />
              <div className="image-upload-box">
                {coverImagePreview && <img src={coverImagePreview} alt="Cover Preview" />}
                <span className="plus">+</span>
                <input type="file" {...register('coverImage')} onChange={(e) => onImageChange(e, setCoverImagePreview)} required />
              </div>
            </div>
            <div>
              <label>Logo</label><br />
              <div className="image-upload-box">
                {logoPreview && <img src={logoPreview} alt="Logo Preview" />}
                <span className="plus">+</span>
                <input type="file" {...register('logo')} onChange={(e) => onImageChange(e, setLogoPreview)} required />
              </div>
            </div>
          </div>
          
          <div>
            <label>About Company</label><br />
            <textarea {...register('about')} style={{ height: '120px' }} required />
          </div>
          <div>
            <label>Founded</label><br />
            <input type="date" {...register('founded')} required />
          </div>
          <div>
            <label>Contact Mail</label><br />
            <input type="email" {...register('contactmail')} required />
          </div>
          <div>
            <label>Company Size</label><br />
            <input type="number" className='mb-3' style={{ width: '500px' }} {...register('size')} required />
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
                <option value="Business development">Business Development</option>
                <option value="Construction">Construction</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Finance">Finance</option>
                <option value="Health Care">Health Care</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing and Communication">Marketing and Communication</option>
                <option value="Software Development">Software Development</option>
                <option value="Project Management">Project Management</option>
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
              {loading ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCompanyForm;
