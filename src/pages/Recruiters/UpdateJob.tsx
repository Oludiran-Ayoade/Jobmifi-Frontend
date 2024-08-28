import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Toast } from 'primereact/toast';

type FormValues = {
  title: string;
  category: string;
  description: string;
  type: string;
  location: string;
  qualifications: { id: string; value: string }[];
  skillsRequired: { id: string; value: string }[];
  jobResponsibilities: { id: string; value: string }[];
  salaryRange: string;
};

const UpdateJobForm: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, control, watch } = useForm<FormValues>();
  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = useFieldArray({
    control,
    name: 'qualifications',
  });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skillsRequired',
  });
  const { fields: responsibilityFields, append: appendResponsibility, remove: removeResponsibility } = useFieldArray({
    control,
    name: 'jobResponsibilities',
  });
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { token } = auth;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/getjobId/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const jobData = response.data.data;
        setValue('title', jobData.title);
        setValue('category', jobData.category);
        setValue('description', jobData.description);
        setValue('type', jobData.type);
        setValue('location', jobData.location);
        setValue(
          'qualifications',
          jobData.qualifications.map((q: string, index: number) => ({ id: `${index}`, value: q })) || []
        );
        setValue(
          'skillsRequired',
          jobData.skillsRequired.map((s: string, index: number) => ({ id: `${index}`, value: s })) || []
        );
        setValue(
          'jobResponsibilities',
          jobData.jobResponsibilities.map((r: string, index: number) => ({ id: `${index}`, value: r })) || []
        );
        setValue('salaryRange', jobData.salaryRange);
      } catch (error) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch job data', life: 3000 });
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, token, setValue]);

  const selectedType = watch('type');

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      await axios.patch(
        `http://localhost:3000/api/users/update/jobs/${id}`,
        {
          ...data,
          qualifications: data.qualifications.map((q) => q.value),
          skillsRequired: data.skillsRequired.map((s) => s.value),
          jobResponsibilities: data.jobResponsibilities.map((r) => r.value),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Job updated successfully',
        life: 2000,
      });
      navigate(`/recruiter/manage-job`);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update job',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} className="custom-toast" />
      <div className="update-job">
        <h3>Update Job</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Job Title</label>
            <br />
            <input type="text" {...register('title')} placeholder="Enter Job Title" required />
          </div>
          <div>
            <label>Category</label>
            <br />
            <input type="text" {...register('category')} placeholder="Enter Job Category" required />
          </div>
          <div>
            <label>Description</label>
            <br />
            <textarea {...register('description')} placeholder="Enter Job Description" required />
          </div>
          <div>
            <label>Job Type</label>
            <br />
            <select {...register('type')} value={selectedType || ''} required>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>
          <div>
            <label>Location</label>
            <br />
            <input type="text" {...register('location')} placeholder="Enter Job Location" required />
          </div>
          <div>
            <label>Qualifications</label>
            <br />
            {qualificationFields.map((field, index) => (
              <div key={field.id}>
                <textarea
                  {...register(`qualifications.${index}.value` as const)}
                  placeholder={`Qualification ${index + 1}`}
                  defaultValue={field.value}
                  required
                  style={{ width: '300px', height: '100px' }}
                />
                <button type="button" className="btn btn-danger mb-2" onClick={() => removeQualification(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-success"
              onClick={() => appendQualification({ id: `${qualificationFields.length}`, value: '' })}
            >
              Add Qualification
            </button>
          </div>
          <div>
            <label>Skills Required</label>
            <br />
            {skillFields.map((field, index) => (
              <div key={field.id}>
                <textarea
                  {...register(`skillsRequired.${index}.value` as const)}
                  placeholder={`Skill ${index + 1}`}
                  defaultValue={field.value}
                  required
                  style={{ width: '300px', height: '100px' }}
                />
                <button type="button" className="btn btn-danger mb-2" onClick={() => removeSkill(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-success" onClick={() => appendSkill({ id: `${skillFields.length}`, value: '' })}>
              Add Skill
            </button>
          </div>
          <div>
            <label>Job Responsibilities</label>
            <br />
            {responsibilityFields.map((field, index) => (
              <div key={field.id}>
                <textarea
                  {...register(`jobResponsibilities.${index}.value` as const)}
                  placeholder={`Responsibility ${index + 1}`}
                  defaultValue={field.value}
                  required
                  style={{ width: '300px', height: '100px' }}
                />
                <button type="button" className="btn btn-danger mb-2" onClick={() => removeResponsibility(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-success"
              onClick={() => appendResponsibility({ id: `${responsibilityFields.length}`, value: '' })}
            >
              Add Responsibility
            </button>
          </div>
          <div>
            <label>Salary Range</label>
            <br />
            <input type="text" {...register('salaryRange')} placeholder="Enter Salary Range" required />
          </div>
          <button type="submit" className="btn btn-success mb-5 mt-1" disabled={loading}>
            {loading ? 'Updating...' : 'Update Job'}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateJobForm;
