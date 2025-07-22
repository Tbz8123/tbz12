import React, { useState, FC, ReactNode } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import ResumePreviewModal from '@/components/modal/ResumePreviewModal';

const FloatingParticles = () => {
    const particles = Array.from({ length: 20 });
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
};

interface RepeatableFieldProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  fields: { name: string }[];
  renderItem: (item: any, index: number, onChange: (index: number, fieldName: string, value: string) => void) => ReactNode;
  buttonText: string;
}

const RepeatableField: FC<RepeatableFieldProps> = ({ items, setItems, fields, renderItem, buttonText }) => {
  const addItem = () => {
    const newItem = fields.reduce((acc: any, field: { name: string }) => ({ ...acc, [field.name]: '' }), {});
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i: number) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index: number, fieldName: string, value: string) => {
    const newItems = [...items];
    newItems[index][fieldName] = value;
    setItems(newItems);
  };

  return (
    <div className="space-y-6">
      {items.map((item: any, index: number) => (
        <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative transition-all duration-300 hover:border-purple-400/50">
          {items.length > 1 && (
            <button
              onClick={() => removeItem(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors p-1 bg-white/10 rounded-full"
            >
              <Trash2 size={16} />
            </button>
          )}
          {renderItem(item, index, handleItemChange)}
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full border-2 border-dashed border-purple-400/30 text-purple-400 hover:text-purple-300 hover:border-purple-300 bg-white/5 hover:bg-purple-500/10 rounded-2xl py-4 transition-all duration-300"
      >
        <Plus size={16} className="inline mr-2" /> {buttonText}
      </button>
    </div>
  );
};

const SectionDetailFormPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/section/:sectionName");
  const sectionName = params?.sectionName || 'personal-details';

  // Connect to ResumeStore with stable selectors
  const resumeData = useResumeStore(state => state.resumeData);
  const actions = useResumeStore(state => state.actions);
  const updateResumeData = actions?.updateResumeData;
  const getProTemplateById = useResumeStore(state => state.getProTemplateById);
  const activeProTemplateId = useResumeStore(state => state.activeProTemplateId);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [personalDetails, setPersonalDetails] = useState({
    dateOfBirth: '', nationality: 'Indian', maritalStatus: 'Single', visaStatus: 'Full working capabilities',
  });
  const [websites, setWebsites] = useState([{ description: '', link: '' }]);
  const [certifications, setCertifications] = useState([{ name: '', organization: '', date: '' }]);
  const [languages, setLanguages] = useState([{ language: '', proficiency: 'Conversational' }]);
  const [software, setSoftware] = useState([{ name: '', proficiency: 'Intermediate' }]);
  const [accomplishments, setAccomplishments] = useState([{ accomplishment: '' }]);
  const [additionalInfo, setAdditionalInfo] = useState([{ info: '' }]);
  const [affiliations, setAffiliations] = useState([{ affiliation: '' }]);
  const [interests, setInterests] = useState([{ interest: '' }]);

  const commonInputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300";
  const commonSelectClass = `${commonInputClass} appearance-none`;
  const commonLabelClass = "block text-sm font-medium text-purple-300 mb-2 uppercase tracking-wider";

  const renderFormContent = () => {
    switch (sectionName) {
      case 'personal-details':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className={commonLabelClass}>Date of Birth</label>
                <input type="text" name="dateOfBirth" value={personalDetails.dateOfBirth} onChange={(e) => setPersonalDetails(p => ({...p, dateOfBirth: e.target.value}))} placeholder="dd/mm/yyyy" className={commonInputClass} />
              </div>
              <div>
                <label className={commonLabelClass}>Nationality</label>
                <input type="text" name="nationality" value={personalDetails.nationality} onChange={(e) => setPersonalDetails(p => ({...p, nationality: e.target.value}))} placeholder="Indian" className={commonInputClass} />
              </div>
              <div>
                <label className={commonLabelClass}>Marital Status</label>
                <select name="maritalStatus" value={personalDetails.maritalStatus} onChange={(e) => setPersonalDetails(p => ({...p, maritalStatus: e.target.value}))} className={commonSelectClass}>
                  <option className="bg-slate-800">Single</option>
                  <option className="bg-slate-800">Married</option>
                </select>
              </div>
              <div>
                <label className={commonLabelClass}>Visa Status</label>
                <input type="text" name="visaStatus" value={personalDetails.visaStatus} onChange={(e) => setPersonalDetails(p => ({...p, visaStatus: e.target.value}))} placeholder="Full working capabilities" className={commonInputClass} />
              </div>
            </div>
          </div>
        );

      case 'websites':
        return <RepeatableField
          items={websites}
          setItems={setWebsites}
          fields={[{ name: 'description' }, { name: 'link' }]}
          buttonText="Add another website"
          renderItem={(item, index, onChange) => (
            <div className="space-y-4">
              <input type="text" placeholder="Description (e.g. Portfolio, GitHub)" value={item.description} onChange={e => onChange(index, 'description', e.target.value)} className={commonInputClass} />
              <input type="text" placeholder="Link (e.g. https://...)" value={item.link} onChange={e => onChange(index, 'link', e.target.value)} className={commonInputClass} />
            </div>
          )}
        />;

      case 'certifications':
        return <RepeatableField
          items={certifications}
          setItems={setCertifications}
          fields={[{ name: 'name' }, { name: 'organization' }, { name: 'date' }]}
          buttonText="Add another certification"
          renderItem={(item, index, onChange) => (
            <div className="space-y-4">
              <input type="text" placeholder="Certification Name" value={item.name} onChange={e => onChange(index, 'name', e.target.value)} className={commonInputClass} />
              <input type="text" placeholder="Issuing Organization" value={item.organization} onChange={e => onChange(index, 'organization', e.target.value)} className={commonInputClass} />
              <input type="text" placeholder="Date Received (e.g., May 2023)" value={item.date} onChange={e => onChange(index, 'date', e.target.value)} className={commonInputClass} />
            </div>
          )}
        />;

      case 'languages':
        return <RepeatableField
          items={languages}
          setItems={setLanguages}
          fields={[{ name: 'language' }, { name: 'proficiency' }]}
          buttonText="Add another language"
          renderItem={(item, index, onChange) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Language (e.g., Spanish)" value={item.language} onChange={e => onChange(index, 'language', e.target.value)} className={commonInputClass} />
              <select value={item.proficiency} onChange={e => onChange(index, 'proficiency', e.target.value)} className={commonSelectClass}>
                <option className="bg-slate-800">Native</option>
                <option className="bg-slate-800">Fluent</option>
                <option className="bg-slate-800">Conversational</option>
                <option className="bg-slate-800">Basic</option>
              </select>
            </div>
          )}
        />;

      case 'software':
        return <RepeatableField
          items={software}
          setItems={setSoftware}
          fields={[{ name: 'name' }, { name: 'proficiency' }]}
          buttonText="Add another software"
          renderItem={(item, index, onChange) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Software (e.g., Adobe Photoshop)" value={item.name} onChange={e => onChange(index, 'name', e.target.value)} className={commonInputClass} />
              <select value={item.proficiency} onChange={e => onChange(index, 'proficiency', e.target.value)} className={commonSelectClass}>
                <option className="bg-slate-800">Expert</option>
                <option className="bg-slate-800">Advanced</option>
                <option className="bg-slate-800">Intermediate</option>
                <option className="bg-slate-800">Beginner</option>
              </select>
            </div>
          )}
        />;

      case 'accomplishments':
        return <RepeatableField
          items={accomplishments}
          setItems={setAccomplishments}
          fields={[{ name: 'accomplishment'}]}
          buttonText="Add another accomplishment"
          renderItem={(item, index, onChange) => (
             <textarea placeholder="e.g., Awarded 'Employee of the Month'..." value={item.accomplishment} onChange={e => onChange(index, 'accomplishment', e.target.value)} className={`${commonInputClass} min-h-[120px]`} />
          )}
        />;

      case 'additional-info':
        return <RepeatableField
          items={additionalInfo}
          setItems={setAdditionalInfo}
          fields={[{ name: 'info'}]}
          buttonText="Add more information"
          renderItem={(item, index, onChange) => (
             <textarea placeholder="e.g., Willing to relocate..." value={item.info} onChange={e => onChange(index, 'info', e.target.value)} className={`${commonInputClass} min-h-[120px]`} />
          )}
        />;

      case 'affiliations':
        return <RepeatableField
          items={affiliations}
          setItems={setAffiliations}
          fields={[{ name: 'affiliation'}]}
          buttonText="Add another affiliation"
          renderItem={(item, index, onChange) => (
             <input type="text" placeholder="e.g., Member of the Project Management Institute" value={item.affiliation} onChange={e => onChange(index, 'affiliation', e.target.value)} className={commonInputClass} />
          )}
        />;

      case 'interests':
      case 'hobbies':
        return <RepeatableField
          items={interests}
          setItems={setInterests}
          fields={[{ name: 'interest'}]}
          buttonText={sectionName === 'interests' ? "Add another interest" : "Add another hobby"}
          renderItem={(item, index, onChange) => (
             <input type="text" placeholder="e.g., Hiking, Reading, Coding" value={item.interest} onChange={e => onChange(index, 'interest', e.target.value)} className={commonInputClass} />
          )}
        />;
    }
    return null;
  };

  const getSectionTitle = () => {
    if (!match) return "Section Details";
    return sectionName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const activeProTemplate = activeProTemplateId ? getProTemplateById(activeProTemplateId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <FloatingParticles />
      <main className="relative z-10 pt-32 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => setLocation('/add-section')}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-all hover:-translate-x-1 duration-300 text-sm font-medium mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </motion.button>

          <div className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-3">{getSectionTitle()}</h1>
            <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-sm">
              <Info size={18} className="text-purple-400 mr-3 shrink-0" />
              <p className="text-gray-300">This is an optional section, and an excellent opportunity to add relevant information.</p>
            </div>
          </div>

          {renderFormContent()}

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center mt-16">
            <button
              onClick={() => setLocation('/add-section')}
              className="text-purple-400 font-medium hover:underline"
            >
              Skip for now
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewModalOpen(true)}
              className="text-purple-400 hover:text-purple-300 border border-purple-400 hover:border-purple-300 font-medium rounded-full px-8 py-2.5 text-base transition-colors duration-300 hover:bg-purple-500/10"
            >
              Preview
              </button>
              <button
                onClick={() => setLocation('/final')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-10 py-2.5 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {isPreviewModalOpen && (
        <ResumePreviewModal 
          isOpen={isPreviewModalOpen} 
          onClose={() => setIsPreviewModalOpen(false)} 
          resumeData={resumeData}
          templateCode={activeProTemplate?.code || ''}
        />
      )}
    </div>
  );
};

export default SectionDetailFormPage;