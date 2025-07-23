(TraeAI-3) C:\Users\mhdtb\OneDrive\Desktop\trae+replitV1\TbzResumeBuilderV4 [0:1] $ ^C
(TraeAI-3) C:\Users\mhdtb\OneDrive\Desktop\trae+replitV1\TbzResumeBuilderV4 [0:1] $ 
(TraeAI-3) C:\Users\mhdtb\OneDrive\Desktop\trae+replitV1\TbzResumeBuilderV4 [0:1] $ npx tsc --noEmit
client-admin/src/App.tsx:4:25 - error TS1149: File name 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client/src/components/ui/Toaster.tsx' differs from already included file name 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client/src/components/ui/toaster.tsx' only in casing.
  The file is in the program because:
    Imported via "@/components/ui/toaster" from file 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client/src/App.tsx'
    Matched by include pattern 'client/src/**/*' in 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/tsconfig.json'
    Imported via "@/components/ui/Toaster" from file 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/src/App.tsx'

4 import { Toaster } from "@/components/ui/Toaster";
                          ~~~~~~~~~~~~~~~~~~~~~~~~~

  client/src/App.tsx:4:25
    4 import { Toaster } from "@/components/ui/toaster";
                              ~~~~~~~~~~~~~~~~~~~~~~~~~
    File is included via import here.
  tsconfig.json:2:15
    2   "include": ["client/src/**/*", "client-admin/src/**/*", "shared/**/*", "server/**/*"],
                    ~~~~~~~~~~~~~~~~~
    File is matched by include pattern specified here.

client-admin/src/components/auth/FirebaseProtectedRoute.tsx:28:40 - error TS2339: Property 'isAdmin' does not exist on type 'ExtendedUser'.

28       if (requireAdmin && !currentUser.isAdmin) {
                                          ~~~~~~~

client-admin/src/components/auth/FirebaseProtectedRoute.tsx:54:53 - error TS2339: Property 'isAdmin' does not exist on type 'ExtendedUser'.

54   if (!currentUser || (requireAdmin && !currentUser.isAdmin)) {
                                                       ~~~~~~~

client-admin/src/components/final-page/EditableSection.tsx:2:29 - error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.

2 import { useNavigate } from 'react-router-dom';
                              ~~~~~~~~~~~~~~~~~~

client-admin/src/components/final-page/ExportOptions.tsx:48:22 - error TS2345: Argument of type '{ personalInfo: { firstName: string; lastName: string; title: string; email: string; phone: string; address: string; summary: string; contactDetails: { linkedin: string; website: string; github: string; }; }; ... 11 more ...; sectionOrder?: string[]; }' is not assignable to parameter of type 'Partial<ResumeData>'.
  Types of property 'education' are incompatible.
    Type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }[]' is not assignable to type 'Education[]'.
      Property 'id' is missing in type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }' but required in type 'Education'.

48     updateResumeData({
                        ~
49       ...resumeData,
   ~~~~~~~~~~~~~~~~~~~~
50       ...sampleData
   ~~~~~~~~~~~~~~~~~~~
51     });
   ~~~~~

  client/src/stores/resumeStore.ts:28:3
    28   id: string;
         ~~
    'id' is declared here.

client-admin/src/components/final-page/FinalPagePreview.tsx:464:32 - error TS7006: Parameter 'data' implicitly has an 'any' type.

464           onUpdateResumeData={(data) => executeResumeDataUpdate('resumeData', data)}
                                   ~~~~

client-admin/src/components/final-page/FinalPagePreview.tsx:465:28 - error TS7006: Parameter 'data' implicitly has an 'any' type.

465           onUpdateSkills={(data) => executeResumeDataUpdate('skills', data)}     
                               ~~~~

client-admin/src/components/final-page/FinalPagePreview.tsx:466:31 - error TS7006: Parameter 'data' implicitly has an 'any' type.

466           onUpdateLanguages={(data) => executeResumeDataUpdate('languages', data)}
                                  ~~~~

client-admin/src/components/final-page/FinalPagePreview.tsx:467:36 - error TS7006: Parameter 'data' implicitly has an 'any' type.

467           onUpdateCertifications={(data) => executeResumeDataUpdate('certifications', data)}
                                       ~~~~

client-admin/src/components/final-page/FinalPagePreview.tsx:468:36 - error TS7006: Parameter 'data' implicitly has an 'any' type.

468           onUpdateCustomSections={(data) => executeResumeDataUpdate('customSections', data)}
                                       ~~~~

client-admin/src/components/final-page/FinalPagePreview.tsx:469:31 - error TS7006: Parameter 'data' implicitly has an 'any' type.

469           onUpdateEducation={(data) => executeResumeDataUpdate('education', data)}
                                  ~~~~

client-admin/src/components/final-page/FinalPagePreview.tsx:470:36 - error TS7006: Parameter 'data' implicitly has an 'any' type.

470           onUpdateWorkExperience={(data) => executeResumeDataUpdate('workExperience', data)}
                                       ~~~~

client-admin/src/components/final-page/SectionReorderModal.tsx:118:54 - error TS2339:
 Property 'resume' does not exist on type 'ResumeState'.

118   const resumeData = useResumeStore((state) => state.resume);
                                                         ~~~~~~

client-admin/src/components/final-page/SectionReorderModal.tsx:119:56 - error TS2339:
 Property 'updateResume' does not exist on type 'ResumeState'.

119   const updateResume = useResumeStore((state) => state.updateResume);
                                                           ~~~~~~~~~~~~

client-admin/src/components/final-page/SectionReorderModal.tsx:168:48 - error TS7006:
 Parameter 'sectionId' implicitly has an 'any' type.

168       const initialSections = currentOrder.map(sectionId => ({
                                                   ~~~~~~~~~

client-admin/src/components/FinalPagePreview.tsx:2:27 - error TS2307: Cannot find module '@/contexts/ResumeContext' or its corresponding type declarations.

2 import { useResume } from '@/contexts/ResumeContext';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/components/FinalPagePreview.tsx:20:37 - error TS7006: Parameter 't' implicitly has an 'any' type.

20     proTemplates: proTemplates?.map(t => ({ id: t.id, name: t.name })),
                                       ~

client-admin/src/components/PersonalInfoPreview.tsx:81:16 - error TS2740: Type '{ resumeData: any; }' is missing the following properties from type '{ resumeData: any; onUpdateResumeData: any; onUpdateSkills: any; onUpdateLanguages: any; onUpdateCertifications: any; onUpdateCustomSections: any; onUpdateEducation: any; onUpdateWorkExperience: any; }': onUpdateResumeData, onUpdateSkills, onUpdateLanguages, onUpdateCertifications, and 3 more.

81               <MultiPageRender resumeData={resumeData} />
                  ~~~~~~~~~~~~~~~

client-admin/src/components/ProPreview.tsx:4:27 - error TS2307: Cannot find module '@/contexts/ResumeContext' or its corresponding type declarations.

4 import { useResume } from '@/contexts/ResumeContext';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/components/resume/ResumePreview.tsx:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client-admin/src/components/resume/SectionEditor.tsx:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema'; // TEMP: Using only ResumeData        
           ~~~~~~~~~~

client-admin/src/components/ResumePreview.tsx:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client-admin/src/components/SubscriptionUpgrade.tsx:141:35 - error TS2307: Cannot find module '@stripe/stripe-js' or its corresponding type declarations.

141       const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!));
                                      ~~~~~~~~~~~~~~~~~~~

client-admin/src/components/templates/TemplatesShowcase.tsx:6:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeTemplateRecord'.

6 import { ResumeTemplateRecord } from '@shared/schema';
           ~~~~~~~~~~~~~~~~~~~~

client-admin/src/components/ui/breadcrumb.tsx:51:6 - error TS2322: Type '{ type?: string | undefined; children?: ReactNode; slot?: string | undefined; style?: CSSProperties | undefined; title?: string | undefined; key?: Key | null | undefined; ... 267 more ...; className: string; }' is not assignable to type 'SlotProps'.
  Types of property 'onBeforeInput' are incompatible.
    Type 'FormEventHandler<HTMLAnchorElement> | undefined' is not assignable to type 'InputEventHandler<HTMLElement> | undefined'.
      Type 'FormEventHandler<HTMLAnchorElement>' is not assignable to type 'InputEventHandler<HTMLElement>'.
        Types of parameters 'event' and 'event' are incompatible.
          Type 'InputEvent<HTMLElement>' is not assignable to type 'FormEvent<HTMLAnchorElement>'.
            Types of property 'currentTarget' are incompatible.
              Type 'EventTarget & HTMLElement' is not assignable to type 'EventTarget & HTMLAnchorElement'.
                Type 'EventTarget & HTMLElement' is missing the following properties from type 'HTMLAnchorElement': charset, coords, download, hreflang, and 21 more.     

51     <Comp
        ~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:9:5 - error TS2339: Property 'isVeryLowPowerDevice' does not exist on type '{ deviceCapabilities: DeviceCapabilities | null; performanceSettings: PerformanceSettings; performanceScore: number; forceMobileMode: boolean; setForceMobileMode: Dispatch<...>; }'.

9     isVeryLowPowerDevice,
      ~~~~~~~~~~~~~~~~~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:10:5 - error TS2339: Property 'isThermalThrottling' does not exist on type '{ deviceCapabilities: DeviceCapabilities | null; performanceSettings: PerformanceSettings; performanceScore: number; forceMobileMode: boolean; setForceMobileMode: Dispatch<...>; }'.

10     isThermalThrottling,
       ~~~~~~~~~~~~~~~~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:11:5 - error TS2339: Property 'batteryOptimizationActive' does not exist on type '{ deviceCapabilities: DeviceCapabilities | null; performanceSettings: PerformanceSettings; performanceScore: number; forceMobileMode: boolean; setForceMobileMode: Dispatch<...>; }'.

11     batteryOptimizationActive
       ~~~~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:17:5 - error TS2339: Property 'isLowPower' does not exist on type '{ mobileOptimizationClasses: string; isMobile: boolean; isTablet: boolean; }'.

17     isLowPower,
       ~~~~~~~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:18:5 - error TS2339: Property 'performanceScore' does not exist on type '{ mobileOptimizationClasses: string; isMobile: boolean; isTablet: boolean; }'.

18     performanceScore,
       ~~~~~~~~~~~~~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:22:54 - error TS2339: Property 'lowGraphicsMode' does not exist on type 'PerformanceSettings'.

22   const hasActiveOptimizations = performanceSettings.lowGraphicsMode ||
                                                        ~~~~~~~~~~~~~~~

client-admin/src/components/ui/MobileOptimizationIndicator.tsx:23:54 - error TS2339: Property 'veryLowGraphicsMode' does not exist on type 'PerformanceSettings'.

23                                  performanceSettings.veryLowGraphicsMode ||       
                                                        ~~~~~~~~~~~~~~~~~~~

client-admin/src/components/ui/sidebar.tsx:446:6 - error TS2322: Type '{ children?: ReactNode; slot?: string | undefined; style?: CSSProperties | undefined; title?: string | undefined; key?: Key | null | undefined; defaultChecked?: boolean | undefined; ... 260 more ...; className: string; }' is not assignable to type 'SlotProps'.
  Types of property 'onBeforeInput' are incompatible.
    Type 'FormEventHandler<HTMLDivElement> | undefined' is not assignable to type 'InputEventHandler<HTMLElement> | undefined'.
      Type 'FormEventHandler<HTMLDivElement>' is not assignable to type 'InputEventHandler<HTMLElement>'.
        Types of parameters 'event' and 'event' are incompatible.
          Type 'InputEvent<HTMLElement>' is not assignable to type 'FormEvent<HTMLDivElement>'.
            Types of property 'currentTarget' are incompatible.
              Type 'EventTarget & HTMLElement' is not assignable to type 'EventTarget & HTMLDivElement'.
                Property 'align' is missing in type 'EventTarget & HTMLElement' but required in type 'HTMLDivElement'.

446     <Comp
         ~~~~

  node_modules/typescript/lib/lib.dom.d.ts:10000:5
    10000     align: string;
              ~~~~~
    'align' is declared here.

client-admin/src/components/ui/sidebar.tsx:467:6 - error TS2322: Type '{ value?: string | number | readonly string[] | undefined; type?: "button" | "reset" | "submit" | undefined; children?: ReactNode; form?: string | undefined; slot?: string | undefined; ... 271 more ...; className: string; }' is not assignable to type 'SlotProps'.      
  Types of property 'onBeforeInput' are incompatible.
    Type 'FormEventHandler<HTMLButtonElement> | undefined' is not assignable to type 'InputEventHandler<HTMLElement> | undefined'.
      Type 'FormEventHandler<HTMLButtonElement>' is not assignable to type 'InputEventHandler<HTMLElement>'.
        Types of parameters 'event' and 'event' are incompatible.
          Type 'InputEvent<HTMLElement>' is not assignable to type 'FormEvent<HTMLButtonElement>'.
            Types of property 'currentTarget' are incompatible.
              Type 'EventTarget & HTMLElement' is not assignable to type 'EventTarget & HTMLButtonElement'.
                Type 'EventTarget & HTMLElement' is missing the following properties from type 'HTMLButtonElement': disabled, form, formAction, formEnctype, and 15 more. 

467     <Comp
         ~~~~

client-admin/src/components/ui/sidebar.tsx:568:8 - error TS2322: Type '{ value?: string | number | readonly string[] | undefined; type?: "button" | "reset" | "submit" | undefined; children?: ReactNode; form?: string | undefined; slot?: string | undefined; ... 273 more ...; className: string; }' is not assignable to type 'SlotProps'.      
  Types of property 'onBeforeInput' are incompatible.
    Type 'FormEventHandler<HTMLButtonElement> | undefined' is not assignable to type 'InputEventHandler<HTMLElement> | undefined'.
      Type 'FormEventHandler<HTMLButtonElement>' is not assignable to type 'InputEventHandler<HTMLElement>'.
        Types of parameters 'event' and 'event' are incompatible.
          Type 'InputEvent<HTMLElement>' is not assignable to type 'FormEvent<HTMLButtonElement>'.
            Types of property 'currentTarget' are incompatible.
              Type 'EventTarget & HTMLElement' is not assignable to type 'EventTarget & HTMLButtonElement'.
                Type 'EventTarget & HTMLElement' is missing the following properties from type 'HTMLButtonElement': disabled, form, formAction, formEnctype, and 15 more. 

568       <Comp
           ~~~~

client-admin/src/components/ui/sidebar.tsx:613:6 - error TS2322: Type '{ value?: string | number | readonly string[] | undefined; type?: "button" | "reset" | "submit" | undefined; children?: ReactNode; form?: string | undefined; slot?: string | undefined; ... 271 more ...; className: string; }' is not assignable to type 'SlotProps'.      
  Types of property 'onBeforeInput' are incompatible.
    Type 'FormEventHandler<HTMLButtonElement> | undefined' is not assignable to type 'InputEventHandler<HTMLElement> | undefined'.
      Type 'FormEventHandler<HTMLButtonElement>' is not assignable to type 'InputEventHandler<HTMLElement>'.
        Types of parameters 'event' and 'event' are incompatible.
          Type 'InputEvent<HTMLElement>' is not assignable to type 'FormEvent<HTMLButtonElement>'.
            Types of property 'currentTarget' are incompatible.
              Type 'EventTarget & HTMLElement' is not assignable to type 'EventTarget & HTMLButtonElement'.
                Type 'EventTarget & HTMLElement' is missing the following properties from type 'HTMLButtonElement': disabled, form, formAction, formEnctype, and 15 more. 

613     <Comp
         ~~~~

client-admin/src/components/ui/sidebar.tsx:727:6 - error TS2322: Type '{ type?: string | undefined; children?: ReactNode; slot?: string | undefined; style?: CSSProperties | undefined; title?: string | undefined; key?: Key | null | undefined; ... 270 more ...; className: string; }' is not assignable to type 'SlotProps'.
  Types of property 'onBeforeInput' are incompatible.
    Type 'FormEventHandler<HTMLAnchorElement> | undefined' is not assignable to type 'InputEventHandler<HTMLElement> | undefined'.
      Type 'FormEventHandler<HTMLAnchorElement>' is not assignable to type 'InputEventHandler<HTMLElement>'.
        Types of parameters 'event' and 'event' are incompatible.
          Type 'InputEvent<HTMLElement>' is not assignable to type 'FormEvent<HTMLAnchorElement>'.
            Types of property 'currentTarget' are incompatible.
              Type 'EventTarget & HTMLElement' is not assignable to type 'EventTarget & HTMLAnchorElement'.
                Type 'EventTarget & HTMLElement' is missing the following properties from type 'HTMLAnchorElement': charset, coords, download, hreflang, and 21 more.     

727     <Comp
         ~~~~

client-admin/src/lib/auth.ts:2:20 - error TS2307: Cannot find module './prisma' or its corresponding type declarations.

2 import prisma from './prisma';
                     ~~~~~~~~~~

client-admin/src/lib/auth.ts:3:49 - error TS2307: Cannot find module 'next' or its corresponding type declarations.

3 import { NextApiRequest, NextApiResponse } from 'next';
                                                  ~~~~~~

client-admin/src/lib/export/docx.ts:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client-admin/src/lib/export/docx.ts:46:30 - error TS7006: Parameter 'e' implicitly has an 'any' type.

46           experience.flatMap(e => [
                                ~

client-admin/src/lib/export/docx.ts:58:29 - error TS7006: Parameter 'e' implicitly has an 'any' type.

58           education.flatMap(e => [
                               ~

client-admin/src/lib/export/docx.ts:67:36 - error TS7006: Parameter 's' implicitly has an 'any' type.

67           new Paragraph(skills.map(s => s.name).join(', ')),
                                      ~

client-admin/src/lib/export/docx.ts:71:39 - error TS7006: Parameter 'l' implicitly has an 'any' type.

71           new Paragraph(languages.map(l => `${l.name} (${l.proficiency})`).join(', ')),
                                         ~

client-admin/src/lib/export/docx.ts:74:35 - error TS7006: Parameter 'section' implicitly has an 'any' type.

74         ...customSections.flatMap(section => createSection(s(section.title), [new Paragraph(s(section.content))])),
                                     ~~~~~~~

client-admin/src/lib/export/pdf.ts:5:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

5 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client-admin/src/lib/export/txt.ts:1:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

1 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client-admin/src/lib/export/txt.ts:31:52 - error TS7006: Parameter 'e' implicitly has an 'any' type.

31   const exp = section('Experience', experience.map(e => `
                                                      ~

client-admin/src/lib/export/txt.ts:38:50 - error TS7006: Parameter 'e' implicitly has an 'any' type.

38   const edu = section('Education', education.map(e => `
                                                    ~

client-admin/src/lib/export/txt.ts:44:49 - error TS7006: Parameter 's' implicitly has an 'any' type.

44   const skillStr = section('Skills', skills.map(s => s.name).join(', '));
                                                   ~

client-admin/src/lib/export/txt.ts:46:51 - error TS7006: Parameter 'l' implicitly has an 'any' type.

46   const lang = section('Languages', languages.map(l => `${l.name} (${l.proficiency})`).join(', '));
                                                     ~

client-admin/src/lib/export/txt.ts:48:37 - error TS7006: Parameter 'c' implicitly has an 'any' type.

48   const custom = customSections.map(c => section(s(c.title), s(c.content))).join('');
                                       ~

client-admin/src/lib/multi-page-template-utils.tsx:143:35 - error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.

143     currentPage.sidebarUnits.push(unit);
                                      ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:154:32 - error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.

154     currentPage.mainUnits.push(unit);
                                   ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:227:26 - error TS7031: Binding element 'edu' implicitly has an 'any' type.

227 const EducationUnit = ({ edu, customColors }) => {
                             ~~~

client-admin/src/lib/multi-page-template-utils.tsx:227:31 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

227 const EducationUnit = ({ edu, customColors }) => {
                                  ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:249:30 - error TS7031: Binding element 'cert' implicitly has an 'any' type.

249 const CertificationUnit = ({ cert, customColors }) => {
                                 ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:249:36 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

249 const CertificationUnit = ({ cert, customColors }) => {
                                       ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:261:27 - error TS7031: Binding element 'section' implicitly has an 'any' type.

261 const CustomMainUnit = ({ section, customColors }) => {
                              ~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:261:36 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

261 const CustomMainUnit = ({ section, customColors }) => {
                                       ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:275:24 - error TS7031: Binding element 'userData' implicitly has an 'any' type.

275 const ContactUnit = ({ userData, customColors }) => {
                           ~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:275:34 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

275 const ContactUnit = ({ userData, customColors }) => {
                                     ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:290:23 - error TS7031: Binding element 'userData' implicitly has an 'any' type.

290 const SkillsUnit = ({ userData, customColors }) => {
                          ~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:290:33 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

290 const SkillsUnit = ({ userData, customColors }) => {
                                    ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:308:26 - error TS7031: Binding element 'userData' implicitly has an 'any' type.

308 const LanguagesUnit = ({ userData, customColors }) => {
                             ~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:308:36 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

308 const LanguagesUnit = ({ userData, customColors }) => {
                                       ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:324:30 - error TS7031: Binding element 'section' implicitly has an 'any' type.

324 const CustomSidebarUnit = ({ section, customColors }) => {
                                 ~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:324:39 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

324 const CustomSidebarUnit = ({ section, customColors }) => {
                                          ~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:354:5 - error TS7031: Binding element 'resumeData' implicitly has an 'any' type.

354     resumeData,
        ~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:355:5 - error TS7031: Binding element 'onUpdateResumeData' implicitly has an 'any' type.

355     onUpdateResumeData,
        ~~~~~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:356:5 - error TS7031: Binding element 'onUpdateSkills' implicitly has an 'any' type.

356     onUpdateSkills,
        ~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:357:5 - error TS7031: Binding element 'onUpdateLanguages' implicitly has an 'any' type.

357     onUpdateLanguages,
        ~~~~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:358:5 - error TS7031: Binding element 'onUpdateCertifications' implicitly has an 'any' type.

358     onUpdateCertifications,
        ~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:359:5 - error TS7031: Binding element 'onUpdateCustomSections' implicitly has an 'any' type.

359     onUpdateCustomSections,
        ~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:360:5 - error TS7031: Binding element 'onUpdateEducation' implicitly has an 'any' type.

360     onUpdateEducation,
        ~~~~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:361:5 - error TS7031: Binding element 'onUpdateWorkExperience' implicitly has an 'any' type.

361     onUpdateWorkExperience
        ~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/lib/multi-page-template-utils.tsx:405:72 - error TS7006: Parameter '_' implicitly has an 'any' type.

405             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                           ~

client-admin/src/lib/multi-page-template-utils.tsx:405:75 - error TS7006: Parameter 'index' implicitly has an 'any' type.

405             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                              ~~~~~  

client-admin/src/lib/multi-page-template-utils.tsx:412:72 - error TS7006: Parameter '_' implicitly has an 'any' type.

412             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                           ~

client-admin/src/lib/multi-page-template-utils.tsx:412:75 - error TS7006: Parameter 'index' implicitly has an 'any' type.

412             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                              ~~~~~  

client-admin/src/lib/multi-page-template-utils.tsx:449:64 - error TS2339: Property 'type' does not exist on type 'never'.

449           const experienceUnits = page.mainUnits.filter(u => u.type === 'experience');
                                                                   ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:450:63 - error TS2339: Property 'type' does not exist on type 'never'.

450           const educationUnits = page.mainUnits.filter(u => u.type === 'education');
                                                                  ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:451:67 - error TS2339: Property 'type' does not exist on type 'never'.

451           const certificationUnits = page.mainUnits.filter(u => u.type === 'certification');
                                                                      ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:475:50 - error TS2339: Property 'id' does not exist on type 'never'.

475                   const content = <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>;
                                                     ~~

client-admin/src/lib/multi-page-template-utils.tsx:480:28 - error TS2339: Property 'type' does not exist on type 'never'.

480                   if (unit.type === 'contact') {
                               ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:483:35 - error TS2339: Property 'id' does not exist on type 'never'.

483                         key={unit.id}
                                      ~~

client-admin/src/lib/multi-page-template-utils.tsx:493:35 - error TS2339: Property 'type' does not exist on type 'never'.

493                   } else if (unit.type === 'skills') {
                                      ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:496:35 - error TS2339: Property 'id' does not exist on type 'never'.

496                         key={unit.id}
                                      ~~

client-admin/src/lib/multi-page-template-utils.tsx:502:76 - error TS2339: Property 'id' does not exist on type 'never'.

502                         onDelete={() => handleDeleteSection('skills', unit.id)}  
                                                                               ~~    

client-admin/src/lib/multi-page-template-utils.tsx:503:74 - error TS2339: Property 'id' does not exist on type 'never'.

503                         onMoveUp={() => handleMoveSection('skills', unit.id, 'up')}
                                                                             ~~      

client-admin/src/lib/multi-page-template-utils.tsx:504:76 - error TS2339: Property 'id' does not exist on type 'never'.

504                         onMoveDown={() => handleMoveSection('skills', unit.id, 'down')}
                                                                               ~~    

client-admin/src/lib/multi-page-template-utils.tsx:509:35 - error TS2339: Property 'type' does not exist on type 'never'.

509                   } else if (unit.type === 'languages') {
                                      ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:512:35 - error TS2339: Property 'id' does not exist on type 'never'.

512                         key={unit.id}
                                      ~~

client-admin/src/lib/multi-page-template-utils.tsx:518:79 - error TS2339: Property 'id' does not exist on type 'never'.

518                         onDelete={() => handleDeleteSection('languages', unit.id)}
                                                                                  ~~ 

client-admin/src/lib/multi-page-template-utils.tsx:519:77 - error TS2339: Property 'id' does not exist on type 'never'.

519                         onMoveUp={() => handleMoveSection('languages', unit.id, 'up')}
                                                                                ~~   

client-admin/src/lib/multi-page-template-utils.tsx:520:79 - error TS2339: Property 'id' does not exist on type 'never'.

520                         onMoveDown={() => handleMoveSection('languages', unit.id, 'down')}
                                                                                  ~~ 

client-admin/src/lib/multi-page-template-utils.tsx:525:35 - error TS2339: Property 'type' does not exist on type 'never'.

525                   } else if (unit.type === 'custom-sidebar') {
                                      ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:528:35 - error TS2339: Property 'id' does not exist on type 'never'.

528                         key={unit.id}
                                      ~~

client-admin/src/lib/multi-page-template-utils.tsx:534:84 - error TS2339: Property 'id' does not exist on type 'never'.

534                         onDelete={() => handleDeleteSection('custom-sidebar', unit.id)}
                                                                                     
  ~~

client-admin/src/lib/multi-page-template-utils.tsx:535:82 - error TS2339: Property 'id' does not exist on type 'never'.

535                         onMoveUp={() => handleMoveSection('custom-sidebar', unit.id, 'up')}
                                                                                     
~~

client-admin/src/lib/multi-page-template-utils.tsx:536:84 - error TS2339: Property 'id' does not exist on type 'never'.

536                         onMoveDown={() => handleMoveSection('custom-sidebar', unit.id, 'down')}
                                                                                     
  ~~

client-admin/src/lib/multi-page-template-utils.tsx:561:45 - error TS2339: Property 'type' does not exist on type 'never'.

561                 {page.mainUnits.some(u => u.type === 'about') && (
                                                ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:580:59 - error TS2339: Property 'type' does not exist on type 'never'.

580                     canMoveUp={page.mainUnits.some(u => u.type === 'about')}     
                                                              ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:588:67 - error TS2339: Property 'id' does not exist on type 'never'.

588                       {experienceUnits.map(unit => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                                                                      ~~

client-admin/src/lib/multi-page-template-utils.tsx:598:59 - error TS2339: Property 'type' does not exist on type 'never'.

598                     canMoveUp={page.mainUnits.some(u => u.type === 'about') || experienceUnits.length > 0}
                                                              ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:606:66 - error TS2339: Property 'id' does not exist on type 'never'.

606                       {educationUnits.map(unit => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                                                                     ~~

client-admin/src/lib/multi-page-template-utils.tsx:616:59 - error TS2339: Property 'type' does not exist on type 'never'.

616                     canMoveUp={page.mainUnits.some(u => u.type === 'about') || experienceUnits.length > 0 || educationUnits.length > 0}
                                                              ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:623:72 - error TS2339: Property 'id' does not exist on type 'never'.

623                         {certificationUnits.map(unit => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                                                                           ~~        

client-admin/src/lib/multi-page-template-utils.tsx:628:47 - error TS2339: Property 'type' does not exist on type 'never'.

628                 {page.mainUnits.filter(u => u.type === 'custom-main').map((unit, index) => {
                                                  ~~~~

client-admin/src/lib/multi-page-template-utils.tsx:629:72 - error TS2339: Property 'type' does not exist on type 'never'.

629                   const customMainUnits = page.mainUnits.filter(u => u.type === 'custom-main');
                                                                           ~~~~      

client-admin/src/lib/multi-page-template-utils.tsx:635:33 - error TS2339: Property 'id' does not exist on type 'never'.

635                       key={unit.id}
                                    ~~

client-admin/src/lib/multi-page-template-utils.tsx:641:79 - error TS2339: Property 'id' does not exist on type 'never'.

641                       onDelete={() => handleDeleteSection('custom-main', unit.id)}
                                                                                  ~~ 

client-admin/src/lib/multi-page-template-utils.tsx:642:77 - error TS2339: Property 'id' does not exist on type 'never'.

642                       onMoveUp={() => handleMoveSection('custom-main', unit.id, 'up')}
                                                                                ~~   

client-admin/src/lib/multi-page-template-utils.tsx:643:79 - error TS2339: Property 'id' does not exist on type 'never'.

643                       onMoveDown={() => handleMoveSection('custom-main', unit.id, 'down')}
                                                                                  ~~ 

client-admin/src/pages/Admin/SubscriptionManagement.tsx:316:22 - error TS18046: 'error' is of type 'unknown'.

316         description: error.message || "Failed to delete package",
                         ~~~~~

client-admin/src/pages/Admin/ViewTemplate.tsx:127:17 - error TS2339: Property 'code' does not exist on type '{}'.

127   if (!template.code || template.code.trim() === '') {
                    ~~~~

client-admin/src/pages/Admin/ViewTemplate.tsx:127:34 - error TS2339: Property 'code' does not exist on type '{}'.

127   if (!template.code || template.code.trim() === '') {
                                     ~~~~

client-admin/src/pages/Admin/ViewTemplate.tsx:137:56 - error TS2339: Property 'name' does not exist on type '{}'.

137           <h1 className="text-2xl font-bold">{template.name} Preview</h1>        
                                                           ~~~~

client-admin/src/pages/Admin/ViewTemplate.tsx:144:64 - error TS2339: Property 'id' does not exist on type '{}'.

144             <Link href={`/admin/snap/templates/edit/${template.id}`}>
                                                                   ~~

client-admin/src/pages/Admin/ViewTemplate.tsx:162:54 - error TS2339: Property 'name' does not exist on type '{}'.

162         <h1 className="text-2xl font-bold">{template.name} Preview</h1>
                                                         ~~~~

client-admin/src/pages/Admin/ViewTemplate.tsx:166:26 - error TS2339: Property 'code' does not exist on type '{}'.

166           code={template.code}
                             ~~~~

client-admin/src/pages/Admin/ViewTemplate.tsx:169:33 - error TS2339: Property 'id' does not exist on type '{}'.

169           key={`view-${template.id}-${template.code?.length || 0}`}
                                    ~~

client-admin/src/pages/Admin/ViewTemplate.tsx:169:48 - error TS2339: Property 'code' does not exist on type '{}'.

169           key={`view-${template.id}-${template.code?.length || 0}`}
                                                   ~~~~

client-admin/src/pages/AuthPage.tsx:127:20 - error TS2322: Type '{ children: Element; watch: UseFormWatch<{ password: string; username: string; }>; getValues: UseFormGetValues<{ password: string; username: string; }>; ... 13 more ...; subscribe: UseFormSubscribe<...>; }' is not assignable to type 'UseFormReturn<{ password: string; username: string; }, any, {}>'.
  The types of 'control._options.formControl' are incompatible between these types.  
    Type 'Omit<UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState"> | undefined' is not assignable to type 'Omit<UseFormReturn<{ password: string; username: string; }, any, {}>, "formState"> | undefined'.
      Type 'Omit<UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState">' is not assignable to type 'Omit<UseFormReturn<{ password: string; username: string; }, any, {}>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; username: string; }>' is not assignable to type 'UseFromSubscribe<{ password: string; username: string; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; username: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "username" | readonly ("password" | "username")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; username: string; }>> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "username" | readonly ("password" | "username")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "username" | readonly ("password" | "username")[] | undefined'.

127                   <Form {...loginForm}>
                       ~~~~

client-admin/src/pages/AuthPage.tsx:130:25 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ password: string; username: string; }, any, { password: string; username: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ password: string; username: string; }, any, { password: string; username: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState"> | undefined' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState"> | undefined'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState">' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; username: string; }>' is not assignable to type 'UseFromSubscribe<{ password: string; username: string; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; username: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "username" | readonly ("password" | "username")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; username: string; }>> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "username" | readonly ("password" | "username")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "username" | readonly ("password" | "username")[] | undefined'.

130                         control={loginForm.control}
                            ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ password: string; username: string; }, "username">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...>'

client-admin/src/pages/AuthPage.tsx:143:25 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ password: string; username: string; }, any, { password: string; username: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ password: string; username: string; }, any, { password: string; username: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState"> | undefined' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState"> | undefined'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState">' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; username: string; }, any, { password: string; username: string; }>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; username: string; }>' is not assignable to type 'UseFromSubscribe<{ password: string; username: string; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; username: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "username" | readonly ("password" | "username")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; username: string; }>> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "username" | readonly ("password" | "username")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "username" | readonly ("password" | "username")[] | undefined'.

143                         control={loginForm.control}
                            ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ password: string; username: string; }, "password">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...>'

client-admin/src/pages/AuthPage.tsx:178:20 - error TS2322: Type '{ children: Element; watch: UseFormWatch<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>; getValues: UseFormGetValues<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>; ... 13 more ...; subscribe: UseFormSubscribe<...>; }' is not assignable to type 'UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, {}>'.
  The types of 'control._options.formControl' are incompatible between these types.  
    Type 'Omit<UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>, "formState"> | undefined' is not assignable to type 'Omit<UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, {}>, "formState"> | undefined'.
      Type 'Omit<UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>, "formState">' is not assignable to type 'Omit<UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, {}>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>' is not assignable to type 'UseFromSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.

178                   <Form {...registerForm}>
                       ~~~~

client-admin/src/pages/AuthPage.tsx:181:25 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: b...' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boolean | unde...'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>' is not assignable to type 'UseFromSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.

181                         control={registerForm.control}
                            ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, "username">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseContro...'

client-admin/src/pages/AuthPage.tsx:194:25 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: b...' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boolean | unde...'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>' is not assignable to type 'UseFromSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.

194                         control={registerForm.control}
                            ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, "password">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseContro...'

client-admin/src/pages/AuthPage.tsx:207:25 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: b...' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boolean | unde...'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>' is not assignable to type 'UseFromSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.

207                         control={registerForm.control}
                            ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, "confirmPassword">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & Us...'

client-admin/src/pages/AuthPage.tsx:220:25 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: b...' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boolean | unde...'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; ...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, any, { password: string; confirmPassword: string; username: string; isAdmin?: boo...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>' is not assignable to type 'UseFromSubscribe<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.
                    Type 'string' is not assignable to type '"password" | "confirmPassword" | "username" | "isAdmin" | readonly ("password" | "confirmPassword" | "username" | "isAdmin")[] | undefined'.

220                         control={registerForm.control}
                            ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ password: string; confirmPassword: string; username: string; isAdmin?: boolean | undefined; }, "isAdmin">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControl...'

client-admin/src/pages/Dashboard.tsx:584:43 - error TS2339: Property 'isAdmin' does not exist on type 'ExtendedUser'.

584                             {currentUser?.isAdmin ? 'Admin' : 'User'}
                                              ~~~~~~~

client-admin/src/pages/JobDescriptionPage.tsx:717:34 - error TS2339: Property 'employer' does not exist on type 'Experience'.

717                     {currentJob?.employer} | {currentJob?.position}
                                     ~~~~~~~~

client-admin/src/pages/JobDescriptionPage.tsx:721:32 - error TS2339: Property 'startMonth' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                   ~~~~~~~~~~

client-admin/src/pages/JobDescriptionPage.tsx:721:57 - error TS2339: Property 'startYear' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                            ~~~~~~~~~

client-admin/src/pages/JobDescriptionPage.tsx:721:83 - error TS2339: Property 'isCurrentJob' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                                                     
 ~~~~~~~~~~~~

client-admin/src/pages/JobDescriptionPage.tsx:721:125 - error TS2339: Property 'endMonth' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                                                     
                                           ~~~~~~~~

client-admin/src/pages/JobDescriptionPage.tsx:721:149 - error TS2339: Property 'endYear' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                                                     
                                                                   ~~~~~~~

client-admin/src/pages/LoginPage.tsx:202:21 - error TS2322: Type '"medium"' is not assignable to type '"small" | "large" | undefined'.

202               <Logo size="medium" />
                        ~~~~

  client/src/components/Logo.tsx:3:37
    3 const Logo = ({ size = "large" }: { size?: "large" | "small" }) => (
                                          ~~~~
    The expected type comes from property 'size' which is declared here on type 'IntrinsicAttributes & { size?: "small" | "large" | undefined; }'

client-admin/src/pages/LoginPage.tsx:232:16 - error TS2322: Type '{ children: Element; watch: UseFormWatch<{ email: string; password: string; }>; getValues: UseFormGetValues<{ email: string; password: string; }>; ... 13 more ...; subscribe: UseFormSubscribe<...>; }' is not assignable to type 'UseFormReturn<{ email: string; password: string; }, any, {}>'.
  The types of 'control._options.formControl' are incompatible between these types.  
    Type 'Omit<UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState"> | undefined' is not assignable to type 'Omit<UseFormReturn<{ email: string; password: string; }, any, {}>, "formState"> | undefined'.
      Type 'Omit<UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState">' is not assignable to type 'Omit<UseFormReturn<{ email: string; password: string; }, any, {}>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | readonly ("email" | "password")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; }>> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | readonly ("email" | "password")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | readonly ("email" | "password")[] | undefined'.

232               <Form {...loginForm}>
                   ~~~~

client-admin/src/pages/LoginPage.tsx:235:21 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; }, any, { email: string; password: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; }, any, { email: string; password: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState"> | undefined' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState"> | undefined'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState">' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | readonly ("email" | "password")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; }>> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | readonly ("email" | "password")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | readonly ("email" | "password")[] | undefined'.

235                     control={loginForm.control}
                        ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ email: string; password: string; }, "email">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...>'

client-admin/src/pages/LoginPage.tsx:256:21 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; }, any, { email: string; password: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; }, any, { email: string; password: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState"> | undefined' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState"> | undefined'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState">' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; }, any, { email: string; password: string; }>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; }>'.
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | readonly ("email" | "password")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; }>> & { ...; }) => void; exact?: boolean | undefined; }'.     
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | readonly ("email" | "password")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | readonly ("email" | "password")[] | undefined'.

256                     control={loginForm.control}
                        ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ email: string; password: string; }, "password">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...>'

client-admin/src/pages/LoginPage.tsx:295:16 - error TS2322: Type '{ children: Element; watch: UseFormWatch<{ email: string; password: string; displayName: string; confirmPassword: string; }>; getValues: UseFormGetValues<{ email: string; password: string; displayName: string; confirmPassword: string; }>; ... 13 more ...; subscribe: UseFormSubscribe<...>; }' is not assignable to type 'UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, {}>'.
  The types of 'control._options.formControl' are incompatible between these types.  
    Type 'Omit<UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "formState"> | undefined' is not assignable to type 'Omit<UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, {}>, "formState"> | undefined'.
      Type 'Omit<UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "formState">' is not assignable to type 'Omit<UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, {}>, "formState">'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>'.        
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; displayName: string; confirmPassword: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.

295               <Form {...registerForm}>
                   ~~~~

client-admin/src/pages/LoginPage.tsx:298:21 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>'.        
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; displayName: string; confirmPassword: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.

298                     control={registerForm.control}
                        ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ email: string; password: string; displayName: string; confirmPassword: string; }, "displayName">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...'

client-admin/src/pages/LoginPage.tsx:318:21 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>'.        
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; displayName: string; confirmPassword: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.

318                     control={registerForm.control}
                        ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ email: string; password: string; displayName: string; confirmPassword: string; }, "email">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...>'

client-admin/src/pages/LoginPage.tsx:339:21 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>'.        
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; displayName: string; confirmPassword: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.

339                     control={registerForm.control}
                        ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ email: string; password: string; displayName: string; confirmPassword: string; }, "password">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerProps<...>'

client-admin/src/pages/LoginPage.tsx:367:21 - error TS2322: Type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").Control<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>'.
  The types of '_options.formControl' are incompatible between these types.
    Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
      Type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/client-admin/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: str...' is not assignable to type 'Omit<import("C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/react-hook-form/dist/types/form").UseFormReturn<{ email: string; password: string; displayName: string; confirmPassword: string; }, any, { email: string; password: string; displayName: string; confirmPassword: string; }>, "for...'.
        Types of property 'subscribe' are incompatible.
          Type 'UseFormSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>' is not assignable to type 'UseFromSubscribe<{ email: string; password: string; displayName: string; confirmPassword: string; }>'.        
            Types of parameters 'payload' and 'payload' are incompatible.
              Type '{ name?: string | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<FormState<{ email: string; password: string; displayName: string; confirmPassword: string; }>> & { ...; }) => void; exact?: boolean | undefined; }' is not assignable to type '{ name?: "email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined; formState?: Partial<ReadFormState> | undefined; callback: (data: Partial<...> & { ...; }) => void; exact?: boolean | undefined; }'.
                Types of property 'name' are incompatible.
                  Type 'string | undefined' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.
                    Type 'string' is not assignable to type '"email" | "password" | "displayName" | "confirmPassword" | readonly ("email" | "password" | "displayName" | "confirmPassword")[] | undefined'.

367                     control={registerForm.control}
                        ~~~~~~~

  node_modules/react-hook-form/dist/types/controller.d.ts:24:5
    24     control?: Control<TFieldValues, any, TTransformedValues>;
           ~~~~~~~
    The expected type comes from property 'control' which is declared here on type 'IntrinsicAttributes & { render: ({ field, fieldState, formState, }: { field: ControllerRenderProps<{ email: string; password: string; displayName: string; confirmPassword: string; }, "confirmPassword">; fieldState: ControllerFieldState; formState: UseFormStateReturn<...>; }) => ReactElement<...>; } & UseControllerPr...'

client-admin/src/pages/PersonalInformationPage.tsx:183:24 - error TS2345: Argument of type '{ personalInfo: { firstName: string; lastName: string; title: string; email: string; phone: string; address: string; summary: string; contactDetails: { linkedin: string; website: string; github: string; }; }; ... 11 more ...; sectionOrder?: string[]; }' is not assignable to parameter of type 'Partial<ResumeData>'.
  Types of property 'education' are incompatible.
    Type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }[]' is not assignable to type 'Education[]'.
      Property 'id' is missing in type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }' but required in type 'Education'.

183       updateResumeData(updateData);
                           ~~~~~~~~~~

  client/src/stores/resumeStore.ts:28:3
    28   id: string;
         ~~
    'id' is declared here.

client-admin/src/pages/ResumeBuilder.tsx:11:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

11 import { ResumeData } from '@shared/schema';
            ~~~~~~~~~~

client-admin/src/pages/ResumeBuilder.tsx:17:32 - error TS2307: Cannot find module '@/components/debug/DownloadTestButton' or its corresponding type declarations.

17 import DownloadTestButton from '@/components/debug/DownloadTestButton';
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client-admin/src/pages/ResumeBuilder.tsx:122:50 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

122         const incompleteExp = experiences.filter(exp =>
                                                     ~~~

client-admin/src/pages/ResumeBuilder.tsx:131:48 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

131         const incompleteEdu = education.filter(edu => !edu.school || !edu.degree || !edu.startDate);
                                                   ~~~

client-admin/src/pages/ResumeBuilder.tsx:652:33 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

652         return experiences.some(exp =>
                                    ~~~

client-admin/src/pages/ResumeBuilder.tsx:662:31 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

662         return education.some(edu =>
                                  ~~~

client-admin/src/pages/ResumeBuilder.tsx:669:51 - error TS7006: Parameter 'skill' implicitly has an 'any' type.

669         return skills.length >= 1 && skills.every(skill => skill.name && skill.name.trim().length > 0);
                                                      ~~~~~

client-admin/src/pages/ResumeBuilder.tsx:673:56 - error TS7006: Parameter 'lang' implicitly has an 'any' type.

673         return languages.length > 0 && languages.every(lang =>
                                                           ~~~~

client-admin/src/pages/ResumeBuilder.tsx:680:66 - error TS7006: Parameter 'section' implicitly has an 'any' type.

680         return customSections.length > 0 && customSections.every(section =>      
                                                                     ~~~~~~~

client-admin/src/pages/ResumeBuilder.tsx:748:19 - error TS7006: Parameter 'prev' implicitly has an 'any' type.

748     setResumeData(prev => ({
                      ~~~~

client-admin/src/pages/ResumeBuilder.tsx:778:67 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

778           const experienceComplete = updatedData.experience?.some(exp =>
                                                                      ~~~

client-admin/src/pages/ResumeBuilder.tsx:781:72 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

781           const prevExperienceComplete = previousData.experience?.some(exp =>    
                                                                           ~~~       

client-admin/src/pages/ResumeBuilder.tsx:787:65 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

787           const educationComplete = updatedData.education?.some(edu =>
                                                                    ~~~

client-admin/src/pages/ResumeBuilder.tsx:790:70 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

790           const prevEducationComplete = previousData.education?.some(edu =>      
                                                                         ~~~

client-admin/src/pages/SkillsPage.tsx:172:56 - error TS2304: Cannot find name 'Skill'.

172   const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
                                                           ~~~~~

client-admin/src/pages/SkillsPage.tsx:181:52 - error TS2304: Cannot find name 'Skill'.

181   const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
                                                       ~~~~~

client-admin/src/pages/SkillsPage.tsx:237:23 - error TS2304: Cannot find name 'Skill'.

237       const newSkill: Skill = {
                          ~~~~~

client-admin/src/pages/SkillsPage.tsx:248:37 - error TS2304: Cannot find name 'Skill'.

248   const handleSkillRating = (skill: Skill, rating: number) => {
                                        ~~~~~

client-admin/src/test-main.tsx:38:56 - error TS18046: 'error' is of type 'unknown'.  

38   document.body.innerHTML = `<h1>Error starting app: ${error.message}</h1>`;      
                                                          ~~~~~

client/src/components/admin/AnalyticsDashboard.tsx:24:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

24 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/components/auth/FirebaseProtectedRoute.tsx:6:25 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

6 import { Loader2 } from 'lucide-react';
                          ~~~~~~~~~~~~~~

client/src/components/auth/FirebaseProtectedRoute.tsx:28:40 - error TS2339: Property 'isAdmin' does not exist on type 'ExtendedUser'.

28       if (requireAdmin && !currentUser.isAdmin) {
                                          ~~~~~~~

client/src/components/auth/FirebaseProtectedRoute.tsx:54:53 - error TS2339: Property 'isAdmin' does not exist on type 'ExtendedUser'.

54   if (!currentUser || (requireAdmin && !currentUser.isAdmin)) {
                                                       ~~~~~~~

client/src/components/features/FeaturesSection.tsx:2:54 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { FileText, Lightbulb, Monitor, Upload } from 'lucide-react';
                                                       ~~~~~~~~~~~~~~

client/src/components/final-page/DesignPanel.tsx:2:40 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { RotateCcw, ChevronDown } from 'lucide-react';
                                         ~~~~~~~~~~~~~~

client/src/components/final-page/EditableSection.tsx:2:29 - error TS2307: Cannot find module 'react-router-dom' or its corresponding type declarations.

2 import { useNavigate } from 'react-router-dom';
                              ~~~~~~~~~~~~~~~~~~

client/src/components/final-page/EditableSection.tsx:3:52 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
                                                     ~~~~~~~~~~~~~~

client/src/components/final-page/ExportOptions.tsx:3:133 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Download, Printer, Mail, Eye, CheckCircle, FileType, FileText, FileUp, Zap, RotateCcw, Plus, Minus, Briefcase, Star } from 'lucide-react';
                                                                                     
                                                 ~~~~~~~~~~~~~~

client/src/components/final-page/ExportOptions.tsx:48:22 - error TS2345: Argument of type '{ personalInfo: { firstName: string; lastName: string; title: string; email: string; phone: string; address: string; summary: string; contactDetails: { linkedin: string; website: string; github: string; }; }; ... 11 more ...; sectionOrder?: string[]; }' is not assignable to parameter of type 'Partial<ResumeData>'.
  Types of property 'education' are incompatible.
    Type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }[]' is not assignable to type 'Education[]'.
      Property 'id' is missing in type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }' but required in type 'Education'.

48     updateResumeData({
                        ~
49       ...resumeData,
   ~~~~~~~~~~~~~~~~~~~~
50       ...sampleData
   ~~~~~~~~~~~~~~~~~~~
51     });
   ~~~~~

  client/src/stores/resumeStore.ts:28:3
    28   id: string;
         ~~
    'id' is declared here.

client/src/components/final-page/FinalPagePreview.tsx:4:62 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { FileText, Loader2, Edit, Trash2, ArrowUpDown } from 'lucide-react';       
                                                               ~~~~~~~~~~~~~~        

client/src/components/final-page/FinalPagePreview.tsx:464:32 - error TS7006: Parameter 'data' implicitly has an 'any' type.

464           onUpdateResumeData={(data) => executeResumeDataUpdate('resumeData', data)}
                                   ~~~~

client/src/components/final-page/FinalPagePreview.tsx:465:28 - error TS7006: Parameter 'data' implicitly has an 'any' type.

465           onUpdateSkills={(data) => executeResumeDataUpdate('skills', data)}     
                               ~~~~

client/src/components/final-page/FinalPagePreview.tsx:466:31 - error TS7006: Parameter 'data' implicitly has an 'any' type.

466           onUpdateLanguages={(data) => executeResumeDataUpdate('languages', data)}
                                  ~~~~

client/src/components/final-page/FinalPagePreview.tsx:467:36 - error TS7006: Parameter 'data' implicitly has an 'any' type.

467           onUpdateCertifications={(data) => executeResumeDataUpdate('certifications', data)}
                                       ~~~~

client/src/components/final-page/FinalPagePreview.tsx:468:36 - error TS7006: Parameter 'data' implicitly has an 'any' type.

468           onUpdateCustomSections={(data) => executeResumeDataUpdate('customSections', data)}
                                       ~~~~

client/src/components/final-page/FinalPagePreview.tsx:469:31 - error TS7006: Parameter 'data' implicitly has an 'any' type.

469           onUpdateEducation={(data) => executeResumeDataUpdate('education', data)}
                                  ~~~~

client/src/components/final-page/FinalPagePreview.tsx:470:36 - error TS7006: Parameter 'data' implicitly has an 'any' type.

470           onUpdateWorkExperience={(data) => executeResumeDataUpdate('workExperience', data)}
                                       ~~~~

client/src/components/final-page/LeftSidebar.tsx:2:58 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { LayoutDashboard, Brush, Type, SpellCheck } from 'lucide-react';
                                                           ~~~~~~~~~~~~~~

client/src/components/final-page/RightActions.tsx:2:51 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { Download, Printer, Mail, FileText } from 'lucide-react';
                                                    ~~~~~~~~~~~~~~

client/src/components/final-page/SectionReorderModal.tsx:22:59 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

22 import { X, GripVertical, Eye, EyeOff, ArrowUpDown } from 'lucide-react';
                                                             ~~~~~~~~~~~~~~

client/src/components/final-page/SectionReorderModal.tsx:118:54 - error TS2339: Property 'resume' does not exist on type 'ResumeState'.

118   const resumeData = useResumeStore((state) => state.resume);
                                                         ~~~~~~

client/src/components/final-page/SectionReorderModal.tsx:119:56 - error TS2339: Property 'updateResume' does not exist on type 'ResumeState'.

119   const updateResume = useResumeStore((state) => state.updateResume);
                                                           ~~~~~~~~~~~~

client/src/components/final-page/SectionReorderModal.tsx:168:48 - error TS7006: Parameter 'sectionId' implicitly has an 'any' type.

168       const initialSections = currentOrder.map(sectionId => ({
                                                   ~~~~~~~~~

client/src/components/final-page/SpellCheckPanel.tsx:2:29 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { CheckCircle } from 'lucide-react';
                              ~~~~~~~~~~~~~~

client/src/components/final-page/TemplateSwitcher.tsx:5:71 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { CheckCircle, LayoutTemplate, Star, Palette, RotateCcw } from 'lucide-react';
                                                                        ~~~~~~~~~~~~~~

client/src/components/final-page/TopBar.tsx:2:57 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { ChevronDown, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
                                                          ~~~~~~~~~~~~~~

client/src/components/FinalPagePreview.tsx:2:27 - error TS2307: Cannot find module '@/contexts/ResumeContext' or its corresponding type declarations.

2 import { useResume } from '@/contexts/ResumeContext';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~

client/src/components/FinalPagePreview.tsx:5:35 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { FileText, Loader2 } from 'lucide-react';
                                    ~~~~~~~~~~~~~~

client/src/components/FinalPagePreview.tsx:20:37 - error TS7006: Parameter 't' implicitly has an 'any' type.

20     proTemplates: proTemplates?.map(t => ({ id: t.id, name: t.name })),
                                       ~

client/src/components/layout/Footer.tsx:4:72 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { Facebook, Instagram, Twitter, Heart, Star, Mail, Globe } from 'lucide-react';
                                                                         ~~~~~~~~~~~~~~

client/src/components/layout/Header.tsx:7:90 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

7 import { Menu, X, Sparkles, Zap, Star, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
                                                                                     
      ~~~~~~~~~~~~~~

client/src/components/modal/DownloadOptionsModal.tsx:5:61 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { X, FileText, File, Download as DownloadIcon } from 'lucide-react';        
                                                              ~~~~~~~~~~~~~~

client/src/components/modal/ResumePreviewModal.tsx:2:48 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { X, Download, Loader2, FileText } from 'lucide-react';
                                                 ~~~~~~~~~~~~~~

client/src/components/PersonalInfoPreview.tsx:2:36 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { FileText, Sparkles } from 'lucide-react';
                                     ~~~~~~~~~~~~~~

client/src/components/PersonalInfoPreview.tsx:81:16 - error TS2740: Type '{ resumeData: any; }' is missing the following properties from type '{ resumeData: any; onUpdateResumeData: any; onUpdateSkills: any; onUpdateLanguages: any; onUpdateCertifications: any; onUpdateCustomSections: any; onUpdateEducation: any; onUpdateWorkExperience: any; }': onUpdateResumeData, onUpdateSkills, onUpdateLanguages, onUpdateCertifications, and 3 more.

81               <MultiPageRender resumeData={resumeData} />
                  ~~~~~~~~~~~~~~~

client/src/components/ProPreview.tsx:3:46 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Eye, Sparkles, GraduationCap } from 'lucide-react';
                                               ~~~~~~~~~~~~~~

client/src/components/ProPreview.tsx:4:27 - error TS2307: Cannot find module '@/contexts/ResumeContext' or its corresponding type declarations.

4 import { useResume } from '@/contexts/ResumeContext';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~

client/src/components/resume/ResumePreview.tsx:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client/src/components/resume/SectionEditor.tsx:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema'; // TEMP: Using only ResumeData        
           ~~~~~~~~~~

client/src/components/resume/SectionEditor.tsx:10:253 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

10 import { Plus, Trash2, Briefcase, GraduationCap, Lightbulb, FolderKanban, Award, Languages as LanguagesIcon, User, Settings2, Linkedin, Globe, Car, Sparkles, TrendingUp, Users, ChevronRight, FileText, Check, Edit2, Sidebar, FileText as MainIcon } from 'lucide-react';
                                                                                     
                                                                                     
                                                                                     
~~~~~~~~~~~~~~

client/src/components/resume/TemplateSelector.tsx:5:69 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { Search, FileText, Check, Sparkles, ArrowRight, User } from 'lucide-react';
                                                                      ~~~~~~~~~~~~~~ 

client/src/components/ResumeDataDebugger.tsx:5:29 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { Eye, EyeOff } from 'lucide-react';
                              ~~~~~~~~~~~~~~

client/src/components/ResumePreview.tsx:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client/src/components/SubscriptionUpgrade.tsx:141:35 - error TS2307: Cannot find module '@stripe/stripe-js' or its corresponding type declarations.

141       const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!));
                                      ~~~~~~~~~~~~~~~~~~~

client/src/components/templates/TemplatesShowcase.tsx:4:30 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ChevronRight } from 'lucide-react';
                               ~~~~~~~~~~~~~~

client/src/components/templates/TemplatesShowcase.tsx:5:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

5 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/components/templates/TemplatesShowcase.tsx:6:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeTemplateRecord'.

6 import { ResumeTemplateRecord } from '@shared/schema';
           ~~~~~~~~~~~~~~~~~~~~

client/src/components/templates/TemplatesShowcase.tsx:43:35 - error TS7006: Parameter 'template' implicitly has an 'any' type.

43             displayTemplates.map((template) => (
                                     ~~~~~~~~

client/src/components/testimonials/TestimonialsSection.tsx:2:22 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { Star } from 'lucide-react';
                       ~~~~~~~~~~~~~~

client/src/components/ui/accordion.tsx:3:29 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ChevronDown } from "lucide-react"
                              ~~~~~~~~~~~~~~

client/src/components/ui/breadcrumb.tsx:3:46 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ChevronRight, MoreHorizontal } from "lucide-react"
                                               ~~~~~~~~~~~~~~

client/src/components/ui/calendar.tsx:2:43 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { ChevronLeft, ChevronRight } from "lucide-react"
                                            ~~~~~~~~~~~~~~

client/src/components/ui/carousel.tsx:5:39 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { ArrowLeft, ArrowRight } from "lucide-react"
                                        ~~~~~~~~~~~~~~

client/src/components/ui/checkbox.tsx:3:23 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Check } from "lucide-react"
                        ~~~~~~~~~~~~~~

client/src/components/ui/command.tsx:4:24 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { Search } from "lucide-react"
                         ~~~~~~~~~~~~~~

client/src/components/ui/context-menu.tsx:3:45 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Check, ChevronRight, Circle } from "lucide-react"
                                              ~~~~~~~~~~~~~~

client/src/components/ui/ContextualTipBar.tsx:3:72 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Lightbulb, TrendingUp, Users, Zap, Target, CheckCircle } from 'lucide-react';
                                                                         ~~~~~~~~~~~~~~

client/src/components/ui/dialog.tsx:5:19 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { X } from "lucide-react"
                    ~~~~~~~~~~~~~~

client/src/components/ui/dropdown-menu.tsx:3:45 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Check, ChevronRight, Circle } from "lucide-react"
                                              ~~~~~~~~~~~~~~

client/src/components/ui/input-otp.tsx:3:21 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Dot } from "lucide-react"
                      ~~~~~~~~~~~~~~

client/src/components/ui/menubar.tsx:5:45 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { Check, ChevronRight, Circle } from "lucide-react"
                                              ~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:4:42 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { Smartphone, Zap, Battery } from 'lucide-react';
                                           ~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:9:5 - error TS2339: Property 'isVeryLowPowerDevice' does not exist on type '{ deviceCapabilities: DeviceCapabilities | null; performanceSettings: PerformanceSettings; performanceScore: number; forceMobileMode: boolean; setForceMobileMode: Dispatch<...>; }'.

9     isVeryLowPowerDevice,
      ~~~~~~~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:10:5 - error TS2339: Property 'isThermalThrottling' does not exist on type '{ deviceCapabilities: DeviceCapabilities | null; performanceSettings: PerformanceSettings; performanceScore: number; forceMobileMode: boolean; setForceMobileMode: Dispatch<...>; }'.

10     isThermalThrottling,
       ~~~~~~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:11:5 - error TS2339: Property 'batteryOptimizationActive' does not exist on type '{ deviceCapabilities: DeviceCapabilities | null; performanceSettings: PerformanceSettings; performanceScore: number; forceMobileMode: boolean; setForceMobileMode: Dispatch<...>; }'.

11     batteryOptimizationActive
       ~~~~~~~~~~~~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:17:5 - error TS2339: Property 'isLowPower' does not exist on type '{ mobileOptimizationClasses: string; isMobile: boolean; isTablet: boolean; }'.

17     isLowPower,
       ~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:18:5 - error TS2339: Property 'performanceScore' does not exist on type '{ mobileOptimizationClasses: string; isMobile: boolean; isTablet: boolean; }'.

18     performanceScore,
       ~~~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:22:54 - error TS2339: Property 'lowGraphicsMode' does not exist on type 'PerformanceSettings'.

22   const hasActiveOptimizations = performanceSettings.lowGraphicsMode ||
                                                        ~~~~~~~~~~~~~~~

client/src/components/ui/MobileOptimizationIndicator.tsx:23:54 - error TS2339: Property 'veryLowGraphicsMode' does not exist on type 'PerformanceSettings'.

23                                  performanceSettings.veryLowGraphicsMode ||       
                                                        ~~~~~~~~~~~~~~~~~~~

client/src/components/ui/navigation-menu.tsx:4:29 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ChevronDown } from "lucide-react"
                              ~~~~~~~~~~~~~~

client/src/components/ui/pagination.tsx:2:59 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

2 import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
                                                            ~~~~~~~~~~~~~~

client/src/components/ui/radio-group.tsx:3:24 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { Circle } from "lucide-react"
                         ~~~~~~~~~~~~~~

client/src/components/ui/resizable.tsx:4:30 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { GripVertical } from "lucide-react"
                               ~~~~~~~~~~~~~~

client/src/components/ui/select.tsx:5:47 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { Check, ChevronDown, ChevronUp } from "lucide-react"
                                                ~~~~~~~~~~~~~~

client/src/components/ui/sheet.tsx:6:19 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

6 import { X } from "lucide-react"
                    ~~~~~~~~~~~~~~

client/src/components/ui/sidebar.tsx:4:27 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { PanelLeft } from "lucide-react"
                            ~~~~~~~~~~~~~~

client/src/components/ui/theme-toggle.tsx:4:27 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { Moon, Sun } from "lucide-react"
                            ~~~~~~~~~~~~~~

client/src/components/ui/toast.tsx:4:19 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { X } from "lucide-react"
                    ~~~~~~~~~~~~~~

client/src/hooks/use-auth.ts:2:29 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useMutation } from "@tanstack/react-query";
                              ~~~~~~~~~~~~~~~~~~~~~~~

client/src/hooks/use-auth.ts:20:17 - error TS7006: Parameter 'data' implicitly has an 'any' type.

20     onSuccess: (data) => setUser(data),
                   ~~~~

client/src/hooks/use-auth.ts:31:17 - error TS7006: Parameter 'data' implicitly has an 'any' type.

31     onSuccess: (data) => setUser(data),
                   ~~~~

client/src/lib/auth.ts:2:20 - error TS2307: Cannot find module './prisma' or its corresponding type declarations.

2 import prisma from './prisma';
                     ~~~~~~~~~~

client/src/lib/auth.ts:3:49 - error TS2307: Cannot find module 'next' or its corresponding type declarations.

3 import { NextApiRequest, NextApiResponse } from 'next';
                                                  ~~~~~~

client/src/lib/export/docx.ts:3:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

3 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client/src/lib/export/docx.ts:46:30 - error TS7006: Parameter 'e' implicitly has an 'any' type.

46           experience.flatMap(e => [
                                ~

client/src/lib/export/docx.ts:58:29 - error TS7006: Parameter 'e' implicitly has an 'any' type.

58           education.flatMap(e => [
                               ~

client/src/lib/export/docx.ts:67:36 - error TS7006: Parameter 's' implicitly has an 'any' type.

67           new Paragraph(skills.map(s => s.name).join(', ')),
                                      ~

client/src/lib/export/docx.ts:71:39 - error TS7006: Parameter 'l' implicitly has an 'any' type.

71           new Paragraph(languages.map(l => `${l.name} (${l.proficiency})`).join(', ')),
                                         ~

client/src/lib/export/docx.ts:74:35 - error TS7006: Parameter 'section' implicitly has an 'any' type.

74         ...customSections.flatMap(section => createSection(s(section.title), [new Paragraph(s(section.content))])),
                                     ~~~~~~~

client/src/lib/export/pdf.ts:5:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

5 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client/src/lib/export/txt.ts:1:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

1 import { ResumeData } from '@shared/schema';
           ~~~~~~~~~~

client/src/lib/export/txt.ts:31:52 - error TS7006: Parameter 'e' implicitly has an 'any' type.

31   const exp = section('Experience', experience.map(e => `
                                                      ~

client/src/lib/export/txt.ts:38:50 - error TS7006: Parameter 'e' implicitly has an 'any' type.

38   const edu = section('Education', education.map(e => `
                                                    ~

client/src/lib/export/txt.ts:44:49 - error TS7006: Parameter 's' implicitly has an 'any' type.

44   const skillStr = section('Skills', skills.map(s => s.name).join(', '));
                                                   ~

client/src/lib/export/txt.ts:46:51 - error TS7006: Parameter 'l' implicitly has an 'any' type.

46   const lang = section('Languages', languages.map(l => `${l.name} (${l.proficiency})`).join(', '));
                                                     ~

client/src/lib/export/txt.ts:48:37 - error TS7006: Parameter 'c' implicitly has an 'any' type.

48   const custom = customSections.map(c => section(s(c.title), s(c.content))).join('');
                                       ~

client/src/lib/firebase.example.ts:26:8 - error TS7016: Could not find a declaration file for module 'firebase/firestore'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/firebase/firestore/dist/esm/index.esm.js' implicitly has an 'any' type.
  If the 'firebase' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'firebase/firestore';`

26 } from 'firebase/firestore';
          ~~~~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:143:35 - error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.

143     currentPage.sidebarUnits.push(unit);
                                      ~~~~

client/src/lib/multi-page-template-utils.tsx:154:32 - error TS2345: Argument of type 'any' is not assignable to parameter of type 'never'.

154     currentPage.mainUnits.push(unit);
                                   ~~~~

client/src/lib/multi-page-template-utils.tsx:227:26 - error TS7031: Binding element 'edu' implicitly has an 'any' type.

227 const EducationUnit = ({ edu, customColors }) => {
                             ~~~

client/src/lib/multi-page-template-utils.tsx:227:31 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

227 const EducationUnit = ({ edu, customColors }) => {
                                  ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:249:30 - error TS7031: Binding element 'cert' implicitly has an 'any' type.

249 const CertificationUnit = ({ cert, customColors }) => {
                                 ~~~~

client/src/lib/multi-page-template-utils.tsx:249:36 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

249 const CertificationUnit = ({ cert, customColors }) => {
                                       ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:261:27 - error TS7031: Binding element 'section' implicitly has an 'any' type.

261 const CustomMainUnit = ({ section, customColors }) => {
                              ~~~~~~~

client/src/lib/multi-page-template-utils.tsx:261:36 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

261 const CustomMainUnit = ({ section, customColors }) => {
                                       ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:275:24 - error TS7031: Binding element 'userData' implicitly has an 'any' type.

275 const ContactUnit = ({ userData, customColors }) => {
                           ~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:275:34 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

275 const ContactUnit = ({ userData, customColors }) => {
                                     ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:290:23 - error TS7031: Binding element 'userData' implicitly has an 'any' type.

290 const SkillsUnit = ({ userData, customColors }) => {
                          ~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:290:33 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

290 const SkillsUnit = ({ userData, customColors }) => {
                                    ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:308:26 - error TS7031: Binding element 'userData' implicitly has an 'any' type.

308 const LanguagesUnit = ({ userData, customColors }) => {
                             ~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:308:36 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

308 const LanguagesUnit = ({ userData, customColors }) => {
                                       ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:324:30 - error TS7031: Binding element 'section' implicitly has an 'any' type.

324 const CustomSidebarUnit = ({ section, customColors }) => {
                                 ~~~~~~~

client/src/lib/multi-page-template-utils.tsx:324:39 - error TS7031: Binding element 'customColors' implicitly has an 'any' type.

324 const CustomSidebarUnit = ({ section, customColors }) => {
                                          ~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:354:5 - error TS7031: Binding element 'resumeData' implicitly has an 'any' type.

354     resumeData,
        ~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:355:5 - error TS7031: Binding element 'onUpdateResumeData' implicitly has an 'any' type.

355     onUpdateResumeData,
        ~~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:356:5 - error TS7031: Binding element 'onUpdateSkills' implicitly has an 'any' type.

356     onUpdateSkills,
        ~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:357:5 - error TS7031: Binding element 'onUpdateLanguages' implicitly has an 'any' type.

357     onUpdateLanguages,
        ~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:358:5 - error TS7031: Binding element 'onUpdateCertifications' implicitly has an 'any' type.

358     onUpdateCertifications,
        ~~~~~~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:359:5 - error TS7031: Binding element 'onUpdateCustomSections' implicitly has an 'any' type.

359     onUpdateCustomSections,
        ~~~~~~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:360:5 - error TS7031: Binding element 'onUpdateEducation' implicitly has an 'any' type.

360     onUpdateEducation,
        ~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:361:5 - error TS7031: Binding element 'onUpdateWorkExperience' implicitly has an 'any' type.

361     onUpdateWorkExperience
        ~~~~~~~~~~~~~~~~~~~~~~

client/src/lib/multi-page-template-utils.tsx:405:72 - error TS7006: Parameter '_' implicitly has an 'any' type.

405             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                           ~

client/src/lib/multi-page-template-utils.tsx:405:75 - error TS7006: Parameter 'index' implicitly has an 'any' type.

405             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                              ~~~~~  

client/src/lib/multi-page-template-utils.tsx:412:72 - error TS7006: Parameter '_' implicitly has an 'any' type.

412             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                           ~

client/src/lib/multi-page-template-utils.tsx:412:75 - error TS7006: Parameter 'index' implicitly has an 'any' type.

412             const updatedSections = resumeData.customSections?.filter((_, index) => index !== sectionIndex) || [];
                                                                              ~~~~~  

client/src/lib/multi-page-template-utils.tsx:449:64 - error TS2339: Property 'type' does not exist on type 'never'.

449           const experienceUnits = page.mainUnits.filter(u => u.type === 'experience');
                                                                   ~~~~

client/src/lib/multi-page-template-utils.tsx:450:63 - error TS2339: Property 'type' does not exist on type 'never'.

450           const educationUnits = page.mainUnits.filter(u => u.type === 'education');
                                                                  ~~~~

client/src/lib/multi-page-template-utils.tsx:451:67 - error TS2339: Property 'type' does not exist on type 'never'.

451           const certificationUnits = page.mainUnits.filter(u => u.type === 'certification');
                                                                      ~~~~

client/src/lib/multi-page-template-utils.tsx:475:50 - error TS2339: Property 'id' does not exist on type 'never'.

475                   const content = <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>;
                                                     ~~

client/src/lib/multi-page-template-utils.tsx:480:28 - error TS2339: Property 'type' does not exist on type 'never'.

480                   if (unit.type === 'contact') {
                               ~~~~

client/src/lib/multi-page-template-utils.tsx:483:35 - error TS2339: Property 'id' does not exist on type 'never'.

483                         key={unit.id}
                                      ~~

client/src/lib/multi-page-template-utils.tsx:493:35 - error TS2339: Property 'type' does not exist on type 'never'.

493                   } else if (unit.type === 'skills') {
                                      ~~~~

client/src/lib/multi-page-template-utils.tsx:496:35 - error TS2339: Property 'id' does not exist on type 'never'.

496                         key={unit.id}
                                      ~~

client/src/lib/multi-page-template-utils.tsx:502:76 - error TS2339: Property 'id' does not exist on type 'never'.

502                         onDelete={() => handleDeleteSection('skills', unit.id)}  
                                                                               ~~    

client/src/lib/multi-page-template-utils.tsx:503:74 - error TS2339: Property 'id' does not exist on type 'never'.

503                         onMoveUp={() => handleMoveSection('skills', unit.id, 'up')}
                                                                             ~~      

client/src/lib/multi-page-template-utils.tsx:504:76 - error TS2339: Property 'id' does not exist on type 'never'.

504                         onMoveDown={() => handleMoveSection('skills', unit.id, 'down')}
                                                                               ~~    

client/src/lib/multi-page-template-utils.tsx:509:35 - error TS2339: Property 'type' does not exist on type 'never'.

509                   } else if (unit.type === 'languages') {
                                      ~~~~

client/src/lib/multi-page-template-utils.tsx:512:35 - error TS2339: Property 'id' does not exist on type 'never'.

512                         key={unit.id}
                                      ~~

client/src/lib/multi-page-template-utils.tsx:518:79 - error TS2339: Property 'id' does not exist on type 'never'.

518                         onDelete={() => handleDeleteSection('languages', unit.id)}
                                                                                  ~~ 

client/src/lib/multi-page-template-utils.tsx:519:77 - error TS2339: Property 'id' does not exist on type 'never'.

519                         onMoveUp={() => handleMoveSection('languages', unit.id, 'up')}
                                                                                ~~   

client/src/lib/multi-page-template-utils.tsx:520:79 - error TS2339: Property 'id' does not exist on type 'never'.

520                         onMoveDown={() => handleMoveSection('languages', unit.id, 'down')}
                                                                                  ~~ 

client/src/lib/multi-page-template-utils.tsx:525:35 - error TS2339: Property 'type' does not exist on type 'never'.

525                   } else if (unit.type === 'custom-sidebar') {
                                      ~~~~

client/src/lib/multi-page-template-utils.tsx:528:35 - error TS2339: Property 'id' does not exist on type 'never'.

528                         key={unit.id}
                                      ~~

client/src/lib/multi-page-template-utils.tsx:534:84 - error TS2339: Property 'id' does not exist on type 'never'.

534                         onDelete={() => handleDeleteSection('custom-sidebar', unit.id)}
                                                                                     
  ~~

client/src/lib/multi-page-template-utils.tsx:535:82 - error TS2339: Property 'id' does not exist on type 'never'.

535                         onMoveUp={() => handleMoveSection('custom-sidebar', unit.id, 'up')}
                                                                                     
~~

client/src/lib/multi-page-template-utils.tsx:536:84 - error TS2339: Property 'id' does not exist on type 'never'.

536                         onMoveDown={() => handleMoveSection('custom-sidebar', unit.id, 'down')}
                                                                                     
  ~~

client/src/lib/multi-page-template-utils.tsx:561:45 - error TS2339: Property 'type' does not exist on type 'never'.

561                 {page.mainUnits.some(u => u.type === 'about') && (
                                                ~~~~

client/src/lib/multi-page-template-utils.tsx:580:59 - error TS2339: Property 'type' does not exist on type 'never'.

580                     canMoveUp={page.mainUnits.some(u => u.type === 'about')}     
                                                              ~~~~

client/src/lib/multi-page-template-utils.tsx:588:67 - error TS2339: Property 'id' does not exist on type 'never'.

588                       {experienceUnits.map(unit => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                                                                      ~~

client/src/lib/multi-page-template-utils.tsx:598:59 - error TS2339: Property 'type' does not exist on type 'never'.

598                     canMoveUp={page.mainUnits.some(u => u.type === 'about') || experienceUnits.length > 0}
                                                              ~~~~

client/src/lib/multi-page-template-utils.tsx:606:66 - error TS2339: Property 'id' does not exist on type 'never'.

606                       {educationUnits.map(unit => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                                                                     ~~

client/src/lib/multi-page-template-utils.tsx:616:59 - error TS2339: Property 'type' does not exist on type 'never'.

616                     canMoveUp={page.mainUnits.some(u => u.type === 'about') || experienceUnits.length > 0 || educationUnits.length > 0}
                                                              ~~~~

client/src/lib/multi-page-template-utils.tsx:623:72 - error TS2339: Property 'id' does not exist on type 'never'.

623                         {certificationUnits.map(unit => <div key={unit.id}>{renderUnit(unit, resumeData, customColors)}</div>)}
                                                                           ~~        

client/src/lib/multi-page-template-utils.tsx:628:47 - error TS2339: Property 'type' does not exist on type 'never'.

628                 {page.mainUnits.filter(u => u.type === 'custom-main').map((unit, index) => {
                                                  ~~~~

client/src/lib/multi-page-template-utils.tsx:629:72 - error TS2339: Property 'type' does not exist on type 'never'.

629                   const customMainUnits = page.mainUnits.filter(u => u.type === 'custom-main');
                                                                           ~~~~      

client/src/lib/multi-page-template-utils.tsx:635:33 - error TS2339: Property 'id' does not exist on type 'never'.

635                       key={unit.id}
                                    ~~

client/src/lib/multi-page-template-utils.tsx:641:79 - error TS2339: Property 'id' does not exist on type 'never'.

641                       onDelete={() => handleDeleteSection('custom-main', unit.id)}
                                                                                  ~~ 

client/src/lib/multi-page-template-utils.tsx:642:77 - error TS2339: Property 'id' does not exist on type 'never'.

642                       onMoveUp={() => handleMoveSection('custom-main', unit.id, 'up')}
                                                                                ~~   

client/src/lib/multi-page-template-utils.tsx:643:79 - error TS2339: Property 'id' does not exist on type 'never'.

643                       onMoveDown={() => handleMoveSection('custom-main', unit.id, 'down')}
                                                                                  ~~ 

client/src/lib/queryClient.ts:1:44 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

1 import { QueryClient, QueryFunction } from "@tanstack/react-query";
                                             ~~~~~~~~~~~~~~~~~~~~~~~

client/src/lib/queryClient.ts:31:12 - error TS7031: Binding element 'queryKey' implicitly has an 'any' type.

31   async ({ queryKey }) => {
              ~~~~~~~~

client/src/main.tsx:6:37 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

6 import { QueryClientProvider } from "@tanstack/react-query";
                                      ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/AddSectionPage.tsx:4:34 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, Check } from 'lucide-react';
                                   ~~~~~~~~~~~~~~

client/src/pages/Admin/AdminProPage.tsx:6:108 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

6 import { LayoutGrid, FileText, Users, Settings, Database, Shield, Server, Palette, Layers, BookText } from "lucide-react";
                                                                                     
                        ~~~~~~~~~~~~~~

client/src/pages/Admin/AdminSnapPage.tsx:5:129 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { FileText, Users, Settings, Code, Layers, FileEdit, Plus, Database, Palette, Server, Shield, Briefcase, BookText } from 'lucide-react';
                                                                                     
                                             ~~~~~~~~~~~~~~

client/src/pages/Admin/AdminTierSelectionPage.tsx:11:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

11 } from "lucide-react";
          ~~~~~~~~~~~~~~

client/src/pages/Admin/DatabaseManagementPage.tsx:6:78 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

6 import { Terminal, ExternalLink, AlertTriangle, Database, Eye, EyeOff } from 'lucide-react';
                                                                               ~~~~~~~~~~~~~~

client/src/pages/Admin/EditProTemplate.tsx:3:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

3 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/EditTemplate.tsx:3:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

3 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/ImportHistory.tsx:15:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

15 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:2:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/ImportHistoryPage.tsx:29:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

29 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:218:21 - error TS7006: Parameter 'query' implicitly has an 'any' type.

218         predicate: (query) => query.queryKey[0] === 'import-history'
                        ~~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:236:17 - error TS7006: Parameter 'data' implicitly has an 'any' type.

236     onSuccess: (data) => {
                    ~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:238:21 - error TS7006: Parameter 'query' implicitly has an 'any' type.

238         predicate: (query) => query.queryKey[0] === 'import-history'
                        ~~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:265:21 - error TS7006: Parameter 'query' implicitly has an 'any' type.

265         predicate: (query) => query.queryKey[0] === 'import-history'
                        ~~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:285:21 - error TS7006: Parameter 'query' implicitly has an 'any' type.

285         predicate: (query) => query.queryKey[0] === 'import-history'
                        ~~~~~

client/src/pages/Admin/ImportHistoryPage.tsx:328:19 - error TS7031: Binding element 'job' implicitly has an 'any' type.

328     onSuccess: ({ job }) => {
                      ~~~

client/src/pages/Admin/ImportHistoryPage.tsx:435:50 - error TS7006: Parameter 'j' implicitly has an 'any' type.

435     const job = importHistoryResponse?.data.find(j => j.id === jobId);
                                                     ~

client/src/pages/Admin/ImportHistoryPage.tsx:1287:38 - error TS7006: Parameter 'job' implicitly has an 'any' type.

1287                     {importJobs.map((job) => (
                                          ~~~

client/src/pages/Admin/JobTitlesManagement.tsx:2:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/JobTitlesManagement.tsx:23:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

23 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/JobTitlesManagement.tsx:187:17 - error TS7006: Parameter 'data' implicitly has an 'any' type.

187     onSuccess: (data, variables) => {
                    ~~~~

client/src/pages/Admin/JobTitlesManagement.tsx:187:23 - error TS7006: Parameter 'variables' implicitly has an 'any' type.

187     onSuccess: (data, variables) => {
                          ~~~~~~~~~

client/src/pages/Admin/JobTitlesManagement.tsx:195:29 - error TS7006: Parameter 'variables' implicitly has an 'any' type.

195     onError: (error: Error, variables) => {
                                ~~~~~~~~~

client/src/pages/Admin/JobTitlesManagement.tsx:259:17 - error TS7006: Parameter 'data' implicitly has an 'any' type.

259     onSuccess: (data, variables) => {
                    ~~~~

client/src/pages/Admin/JobTitlesManagement.tsx:259:23 - error TS7006: Parameter 'variables' implicitly has an 'any' type.

259     onSuccess: (data, variables) => {
                          ~~~~~~~~~

client/src/pages/Admin/JobTitlesManagement.tsx:264:29 - error TS7006: Parameter 'variables' implicitly has an 'any' type.

264     onError: (error: Error, variables) => {
                                ~~~~~~~~~

client/src/pages/Admin/ProfessionalSummaryManagement.tsx:2:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/ProfessionalSummaryManagement.tsx:23:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

23 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/ProTemplateEditor.tsx:8:45 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

8 import { useQueryClient, useMutation } from '@tanstack/react-query';
                                              ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Admin/ProTemplateEditor.tsx:17:71 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

17 import { Sparkles, Image, Palette, Zap, Eye, Upload, ArrowLeft } from 'lucide-react';
                                                                         ~~~~~~~~~~~~~~

client/src/pages/Admin/ProTemplatesManagement.tsx:2:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/ProTemplatesManagement.tsx:6:60 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

6 import { ArrowLeft, Plus, Eye, Edit, Trash2, Search } from 'lucide-react';
                                                             ~~~~~~~~~~~~~~

client/src/pages/Admin/ProTemplatesManagement.tsx:68:47 - error TS7006: Parameter 't' implicitly has an 'any' type.

68   const filteredTemplates = templates.filter((t) => {
                                                 ~

client/src/pages/Admin/ProTemplatesManagement.tsx:169:43 - error TS7006: Parameter 'template' implicitly has an 'any' type.

169                   {filteredTemplates.map((template) => (
                                              ~~~~~~~~

client/src/pages/Admin/SkillsManagement.tsx:2:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/SkillsManagement.tsx:23:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

23 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/SnapTemplateEditor.tsx:8:45 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

8 import { useQueryClient, useMutation } from '@tanstack/react-query';
                                              ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Admin/SnapTemplateEditor.tsx:17:60 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

17 import { Sparkles, Image, Palette, Zap, Eye, Upload } from 'lucide-react';        
                                                              ~~~~~~~~~~~~~~

client/src/pages/Admin/SubscriptionManagement.tsx:27:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

27 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/SubscriptionManagement.tsx:316:22 - error TS18046: 'error' is of type 'unknown'.

316         description: error.message || "Failed to delete package",
                         ~~~~~

client/src/pages/Admin/TemplatesManagement.tsx:2:55 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';     
                                                        ~~~~~~~~~~~~~~~~~~~~~~~      

client/src/pages/Admin/TemplatesManagement.tsx:53:47 - error TS7006: Parameter 't' implicitly has an 'any' type.

53   const filteredTemplates = templates.filter((t) => {
                                                 ~

client/src/pages/Admin/TemplatesManagement.tsx:99:42 - error TS7006: Parameter 'template' implicitly has an 'any' type.

99               ) : filteredTemplates.map((template) => (
                                            ~~~~~~~~

client/src/pages/Admin/UserManagementPage.tsx:18:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

18 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Admin/ViewProTemplate.tsx:3:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

3 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Admin/ViewProTemplate.tsx:7:33 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

7 import { ArrowLeft, Edit } from 'lucide-react';
                                  ~~~~~~~~~~~~~~

client/src/pages/Admin/ViewTemplate.tsx:3:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

3 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Admin/ViewTemplate.tsx:8:40 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

8 import { ArrowLeft, AlertCircle } from 'lucide-react';
                                         ~~~~~~~~~~~~~~

client/src/pages/CheckoutPage.tsx:18:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

18 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Dashboard.tsx:4:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

4 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Dashboard.tsx:25:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

25 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Dashboard.tsx:584:43 - error TS2339: Property 'isAdmin' does not exist on type 'ExtendedUser'.

584                             {currentUser?.isAdmin ? 'Admin' : 'User'}
                                              ~~~~~~~

client/src/pages/EducationPage.tsx:3:82 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Plus, CheckCircle } from 'lucide-react';
                                                                                   ~~~~~~~~~~~~~~

client/src/pages/EducationSummaryPage.tsx:4:107 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, HelpCircle, Edit, Trash, ArrowRight, CheckCircle, PlusCircle, School, BookOpen } from 'lucide-react';
                                                                                     
                       ~~~~~~~~~~~~~~

client/src/pages/FinalPage.tsx:3:39 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { PanelLeft, PanelRight } from 'lucide-react';
                                        ~~~~~~~~~~~~~~

client/src/pages/Home.tsx:5:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

5 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Home.tsx:23:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

23 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/Home.tsx:671:50 - error TS7006: Parameter 'template' implicitly has an 'any' type.

671   const userResumes = templates.slice(0, 4).map((template, index) => {
                                                     ~~~~~~~~

client/src/pages/Home.tsx:671:60 - error TS7006: Parameter 'index' implicitly has an 'any' type.

671   const userResumes = templates.slice(0, 4).map((template, index) => {
                                                               ~~~~~

client/src/pages/Home.tsx:694:50 - error TS7006: Parameter 't' implicitly has an 'any' type.

694   console.log('[Home] Templates:', templates.map(t => ({ id: t.id, name: t.name })));
                                                     ~

client/src/pages/Home.tsx:695:62 - error TS7006: Parameter 'r' implicitly has an 'any' type.

695   console.log('[Home] UserResumes created:', userResumes.map(r => ({ id: r.id, template: r.template })));
                                                                 ~

client/src/pages/Home.tsx:952:47 - error TS7006: Parameter 'resume' implicitly has an 'any' type.

952                 {userResumes.slice(0, 6).map((resume, index) => (
                                                  ~~~~~~

client/src/pages/Home.tsx:952:55 - error TS7006: Parameter 'index' implicitly has an 'any' type.

952                 {userResumes.slice(0, 6).map((resume, index) => (
                                                          ~~~~~

client/src/pages/JobDescriptionPage.tsx:5:90 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

5 import { ArrowLeft, HelpCircle, Search, Plus, ArrowRight, RotateCw, Undo2, X, Eye } from 'lucide-react';
                                                                                     
      ~~~~~~~~~~~~~~

client/src/pages/JobDescriptionPage.tsx:717:34 - error TS2339: Property 'employer' does not exist on type 'Experience'.

717                     {currentJob?.employer} | {currentJob?.position}
                                     ~~~~~~~~

client/src/pages/JobDescriptionPage.tsx:721:32 - error TS2339: Property 'startMonth' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                   ~~~~~~~~~~

client/src/pages/JobDescriptionPage.tsx:721:57 - error TS2339: Property 'startYear' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                            ~~~~~~~~~

client/src/pages/JobDescriptionPage.tsx:721:83 - error TS2339: Property 'isCurrentJob' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                                                     
 ~~~~~~~~~~~~

client/src/pages/JobDescriptionPage.tsx:721:125 - error TS2339: Property 'endMonth' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                                                     
                                           ~~~~~~~~

client/src/pages/JobDescriptionPage.tsx:721:149 - error TS2339: Property 'endYear' does not exist on type 'Experience'.

721                   {currentJob?.startMonth} {currentJob?.startYear} - {currentJob?.isCurrentJob ? 'Present' : `${currentJob?.endMonth} ${currentJob?.endYear}`}        
                                                                                     
                                                                   ~~~~~~~

client/src/pages/LoginPage.tsx:28:55 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

28 import { Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-react';
                                                         ~~~~~~~~~~~~~~

client/src/pages/LoginPage.tsx:202:21 - error TS2322: Type '"medium"' is not assignable to type '"small" | "large" | undefined'.

202               <Logo size="medium" />
                        ~~~~

  client/src/components/Logo.tsx:3:37
    3 const Logo = ({ size = "large" }: { size?: "large" | "small" }) => (
                                          ~~~~
    The expected type comes from property 'size' which is declared here on type 'IntrinsicAttributes & { size?: "small" | "large" | undefined; }'

client/src/pages/not-found.tsx:3:29 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { AlertCircle } from "lucide-react";
                              ~~~~~~~~~~~~~~

client/src/pages/OrderSuccessPage.tsx:14:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

14 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/PackageSelection.tsx:4:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

4 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/PackageSelection.tsx:25:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

25 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/PackageSelection.tsx:814:13 - error TS7006: Parameter 'pkg' implicitly has an 'any' type.

814     .filter(pkg => pkg.isActive)
                ~~~

client/src/pages/PackageSelection.tsx:815:12 - error TS7006: Parameter 'a' implicitly has an 'any' type.

815     .sort((a, b) => a.displayOrder - b.displayOrder);
               ~

client/src/pages/PackageSelection.tsx:815:15 - error TS7006: Parameter 'b' implicitly has an 'any' type.

815     .sort((a, b) => a.displayOrder - b.displayOrder);
                  ~

client/src/pages/PackageSelection.tsx:1085:36 - error TS7006: Parameter 'pkg' implicitly has an 'any' type.

1085               {activePackages.map((pkg, index) => {
                                        ~~~

client/src/pages/PackageSelection.tsx:1085:41 - error TS7006: Parameter 'index' implicitly has an 'any' type.

1085               {activePackages.map((pkg, index) => {
                                             ~~~~~

client/src/pages/PackageSelection.tsx:1093:52 - error TS7006: Parameter 'feature' implicitly has an 'any' type.

1093                 const features = pkg.features.map((feature, idx) => ({
                                                        ~~~~~~~

client/src/pages/PackageSelection.tsx:1093:61 - error TS7006: Parameter 'idx' implicitly has an 'any' type.

1093                 const features = pkg.features.map((feature, idx) => ({
                                                                 ~~~

client/src/pages/PersonalInformationPage.tsx:3:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

3 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/PersonalInformationPage.tsx:4:228 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, Info, Upload, Linkedin, Link as LinkIcon, Car, Eye, ArrowUp, User, Sparkles, Check, FileText, Briefcase, GraduationCap, Award, Settings, CheckCircle, LayoutTemplate, Star, Zap, RotateCcw, Plus, Minus } from 'lucide-react';
                                                                                     
                                                                                     
                                                           ~~~~~~~~~~~~~~

client/src/pages/PersonalInformationPage.tsx:183:24 - error TS2345: Argument of type '{ personalInfo: { firstName: string; lastName: string; title: string; email: string; phone: string; address: string; summary: string; contactDetails: { linkedin: string; website: string; github: string; }; }; ... 11 more ...; sectionOrder?: string[]; }' is not assignable to parameter of type 'Partial<ResumeData>'.
  Types of property 'education' are incompatible.
    Type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }[]' is not assignable to type 'Education[]'.
      Property 'id' is missing in type '{ school: string; degree: string; location: string; startDate: string; endDate: string; graduationDate: string; description: string; }' but required in type 'Education'.

183       updateResumeData(updateData);
                           ~~~~~~~~~~

  client/src/stores/resumeStore.ts:28:3
    28   id: string;
         ~~
    'id' is declared here.

client/src/pages/Preview.tsx:2:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

2 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/Preview.tsx:30:45 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

30 import { ArrowLeft, Download, Share2 } from 'lucide-react';
                                               ~~~~~~~~~~~~~~

client/src/pages/ProfessionalSummaryPage.tsx:3:86 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ArrowLeft, HelpCircle, Search, Plus, ArrowRight, X, CheckCircle, Eye } from 'lucide-react';
                                                                                     
  ~~~~~~~~~~~~~~

client/src/pages/ResumeBuilder.tsx:5:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

5 import { useQuery } from '@tanstack/react-query';
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/ResumeBuilder.tsx:11:10 - error TS2305: Module '"@shared/schema"' has no exported member 'ResumeData'.

11 import { ResumeData } from '@shared/schema';
            ~~~~~~~~~~

client/src/pages/ResumeBuilder.tsx:17:32 - error TS2307: Cannot find module '@/components/debug/DownloadTestButton' or its corresponding type declarations.

17 import DownloadTestButton from '@/components/debug/DownloadTestButton';
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/ResumeBuilder.tsx:19:152 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

19 import { CheckCircle, Circle, Download, Eye, Sparkles, User, Briefcase, GraduationCap, Settings, Award, Languages, Plus, TrendingUp, ArrowRight } from 'lucide-react'; 
                                                                                     
                                                                     ~~~~~~~~~~~~~~  

client/src/pages/ResumeBuilder.tsx:122:50 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

122         const incompleteExp = experiences.filter(exp =>
                                                     ~~~

client/src/pages/ResumeBuilder.tsx:131:48 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

131         const incompleteEdu = education.filter(edu => !edu.school || !edu.degree || !edu.startDate);
                                                   ~~~

client/src/pages/ResumeBuilder.tsx:610:25 - error TS7006: Parameter 'template' implicitly has an 'any' type.

610     ? snapTemplates.map(template => ({ ...template, templateType: 'snap' as const }))
                            ~~~~~~~~

client/src/pages/ResumeBuilder.tsx:611:24 - error TS7006: Parameter 'template' implicitly has an 'any' type.

611     : proTemplates.map(template => ({ ...template, templateType: 'pro' as const }));
                           ~~~~~~~~

client/src/pages/ResumeBuilder.tsx:623:53 - error TS7006: Parameter 't' implicitly has an 'any' type.

623   console.log('📋 Template details:', templates.map(t => ({ id: t.id, name: t.name, type: t.templateType })));
                                                        ~

client/src/pages/ResumeBuilder.tsx:652:33 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

652         return experiences.some(exp =>
                                    ~~~

client/src/pages/ResumeBuilder.tsx:662:31 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

662         return education.some(edu =>
                                  ~~~

client/src/pages/ResumeBuilder.tsx:669:51 - error TS7006: Parameter 'skill' implicitly has an 'any' type.

669         return skills.length >= 1 && skills.every(skill => skill.name && skill.name.trim().length > 0);
                                                      ~~~~~

client/src/pages/ResumeBuilder.tsx:673:56 - error TS7006: Parameter 'lang' implicitly has an 'any' type.

673         return languages.length > 0 && languages.every(lang =>
                                                           ~~~~

client/src/pages/ResumeBuilder.tsx:680:66 - error TS7006: Parameter 'section' implicitly has an 'any' type.

680         return customSections.length > 0 && customSections.every(section =>      
                                                                     ~~~~~~~

client/src/pages/ResumeBuilder.tsx:748:19 - error TS7006: Parameter 'prev' implicitly has an 'any' type.

748     setResumeData(prev => ({
                      ~~~~

client/src/pages/ResumeBuilder.tsx:778:67 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

778           const experienceComplete = updatedData.experience?.some(exp =>
                                                                      ~~~

client/src/pages/ResumeBuilder.tsx:781:72 - error TS7006: Parameter 'exp' implicitly has an 'any' type.

781           const prevExperienceComplete = previousData.experience?.some(exp =>    
                                                                           ~~~       

client/src/pages/ResumeBuilder.tsx:787:65 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

787           const educationComplete = updatedData.education?.some(edu =>
                                                                    ~~~

client/src/pages/ResumeBuilder.tsx:790:70 - error TS7006: Parameter 'edu' implicitly has an 'any' type.

790           const prevEducationComplete = previousData.education?.some(edu =>      
                                                                         ~~~

client/src/pages/ResumeBuilder.tsx:894:41 - error TS7006: Parameter 't' implicitly has an 'any' type.

894   const activeTemplate = templates.find(t => t.id === activeTemplateId);
                                            ~

client/src/pages/ResumeBuilder.tsx:898:73 - error TS7006: Parameter 't' implicitly has an 'any' type.

898   console.log('[ResumeBuilder] All available templates:', templates.map(t => ({ id: t.id, name: t.name })));
                                                                            ~        

client/src/pages/SectionDetailFormPage.tsx:4:47 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, Info, Plus, Trash2 } from 'lucide-react';
                                                ~~~~~~~~~~~~~~

client/src/pages/SkillsPage.tsx:13:8 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

13 } from 'lucide-react';
          ~~~~~~~~~~~~~~

client/src/pages/SkillsPage.tsx:172:56 - error TS2304: Cannot find name 'Skill'.     

172   const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
                                                           ~~~~~

client/src/pages/SkillsPage.tsx:181:52 - error TS2304: Cannot find name 'Skill'.     

181   const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
                                                       ~~~~~

client/src/pages/SkillsPage.tsx:237:23 - error TS2304: Cannot find name 'Skill'.     

237       const newSkill: Skill = {
                          ~~~~~

client/src/pages/SkillsPage.tsx:248:37 - error TS2304: Cannot find name 'Skill'.     

248   const handleSkillRating = (skill: Skill, rating: number) => {
                                        ~~~~~

client/src/pages/SkillsSummaryPage.tsx:3:97 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ArrowLeft, HelpCircle, Edit, Trash, PlusCircle, Star, CheckCircle, BrainCircuit } from 'lucide-react';
                                                                                     
             ~~~~~~~~~~~~~~

client/src/pages/TemplatesPage.tsx:4:26 - error TS2307: Cannot find module '@tanstack/react-query' or its corresponding type declarations.

4 import { useQuery } from "@tanstack/react-query";
                           ~~~~~~~~~~~~~~~~~~~~~~~

client/src/pages/TemplatesPage.tsx:9:37 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

9 import { Info, Search, Check } from "lucide-react";
                                      ~~~~~~~~~~~~~~

client/src/pages/TemplatesPage.tsx:62:45 - error TS7006: Parameter 'template' implicitly has an 'any' type.

62   const templates = fetchedProTemplates.map(template => ({ ...template, templateType: 'pro' as const }));
                                               ~~~~~~~~

client/src/pages/TestPreview.tsx:4:37 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, Download } from 'lucide-react';
                                      ~~~~~~~~~~~~~~

client/src/pages/UploadOptionsPage.tsx:4:43 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, FileUp, Pencil } from 'lucide-react';
                                            ~~~~~~~~~~~~~~

client/src/pages/WhyNeedResumePage.tsx:3:83 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ArrowLeft, User, Briefcase, GraduationCap, Award, Settings, Check } from 'lucide-react';
                                                                                    ~~~~~~~~~~~~~~

client/src/pages/WorkExperienceDetailsPage.tsx:3:73 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

3 import { ArrowLeft, HelpCircle, CheckCircle, Search, ChevronDown } from 'lucide-react';
                                                                          ~~~~~~~~~~~~~~

client/src/pages/WorkHistorySummaryPage.tsx:4:89 - error TS7016: Could not find a declaration file for module 'lucide-react'. 'C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/lucide-react/dist/cjs/lucide-react.js' implicitly has an 'any' type.
  If the 'lucide-react' package actually exposes this module, try adding a new declaration (.d.ts) file containing `declare module 'lucide-react';`

4 import { ArrowLeft, HelpCircle, Edit, Trash, ArrowRight, CheckCircle, PlusCircle } from 'lucide-react';
                                                                                     
     ~~~~~~~~~~~~~~

client/src/test-main.tsx:38:56 - error TS18046: 'error' is of type 'unknown'.        

38   document.body.innerHTML = `<h1>Error starting app: ${error.message}</h1>`;      
                                                          ~~~~~

server/custom-vite.ts:36:15 - error TS7006: Parameter 'msg' implicitly has an 'any' type.

36       error: (msg, options) => {
                 ~~~

server/custom-vite.ts:36:20 - error TS7006: Parameter 'options' implicitly has an 'any' type.

36       error: (msg, options) => {
                      ~~~~~~~

server/custom-vite.ts:64:39 - error TS2345: Argument of type '{ configFile: boolean; customLogger: { error: (msg: any, options: any) => void; info(msg: string, options?: LogOptions | undefined): void; warn(msg: string, options?: LogOptions | undefined): void; warnOnce(msg: string, options?: LogOptions | undefined): void; clearScreen(type: LogType): void; hasErrorLogged(error: ...' is not assignable to parameter of type 'InlineConfig'.
  Types of property 'configFile' are incompatible.
    Type 'boolean' is not assignable to type 'string | false | undefined'.

64   const vite = await createViteServer(viteConfig);
                                         ~~~~~~~~~~

server/db.ts:3:26 - error TS2305: Module '"@shared/schema"' has no exported member 'resumeTemplates'.

3 import { users, resumes, resumeTemplates } from "@shared/schema";
                           ~~~~~~~~~~~~~~~

server/index.ts:138:17 - error TS2339: Property 'code' does not exist on type 'Error'.

138       if (error.code === 'EADDRINUSE') {
                    ~~~~

server/middleware/usageLimits.ts:85:9 - error TS2322: Type '{ usageStats: { id: string; createdAt: Date; updatedAt: Date; userId: string; resumesCreated: number; resumesDownloaded: number; templatesUsed: number; monthlyResumes: number; monthlyDownloads: number; ... 11 more ...; averageSessionTime: number | null; } | null; ... 25 more ...; subscriptionEndsAt: Date | null; }' is not assignable to type '{ id: string; firebaseUid: string; currentTier: string; usageStats?: any; }'.
  Types of property 'firebaseUid' are incompatible.
    Type 'string | null' is not assignable to type 'string'.
      Type 'null' is not assignable to type 'string'.

85         req.user = { ...user, usageStats: stats };
           ~~~~~~~~

server/middleware/usageLimits.ts:122:7 - error TS2322: Type '{ usageStats: { id: string; createdAt: Date; updatedAt: Date; userId: string; resumesCreated: number; resumesDownloaded: number; templatesUsed: number; monthlyResumes: number; monthlyDownloads: number; ... 11 more ...; averageSessionTime: number | null; } | null; ... 25 more ...; subscriptionEndsAt: Date | null; }' is not assignable to type '{ id: string; firebaseUid: string; currentTier: string; usageStats?: any; }'.
  Types of property 'firebaseUid' are incompatible.
    Type 'string | null' is not assignable to type 'string'.
      Type 'null' is not assignable to type 'string'.

122       req.user = { ...user, usageStats: stats };
          ~~~~~~~~

server/middleware/usageLimits.ts:185:7 - error TS2322: Type '{ permissions: { id: string; userId: string; permission: PermissionType; grantedAt: Date; grantedBy: string | null; }[]; } & { email: string; password: string | null; ... 23 more ...; subscriptionEndsAt: Date | null; }' is not assignable to type '{ id: string; firebaseUid: string; currentTier: string; usageStats?: any; } | undefined'.
  Type '{ permissions: { id: string; userId: string; permission: PermissionType; grantedAt: Date; grantedBy: string | null; }[]; } & { email: string; password: string | null; ... 23 more ...; subscriptionEndsAt: Date | null; }' is not assignable to type '{ id: string; firebaseUid: string; currentTier: string; usageStats?: any; }'.        
    Types of property 'firebaseUid' are incompatible.
      Type 'string | null' is not assignable to type 'string'.
        Type 'null' is not assignable to type 'string'.

185       req.user = user;
          ~~~~~~~~

server/middleware/visitorTracking.ts:30:38 - error TS2802: Type 'Map<string, VisitorSession>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

30   for (const [sessionId, session] of activeSessions) {
                                        ~~~~~~~~~~~~~~

server/middleware/visitorTracking.ts:47:35 - error TS2304: Cannot find name 'globalPrisma'.

47     const deletedSessions = await globalPrisma.visitorAnalytics.deleteMany({      
                                     ~~~~~~~~~~~~

server/middleware/visitorTracking.ts:292:7 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

292       userId: session?.userId,
          ~~~~~~

  server/services/analyticsService.ts:25:3
    25   userId?: string;
         ~~~~~~
    The expected type comes from property 'userId' which is declared here on type 'TrackActivityData'

server/middleware/visitorTracking.ts:299:7 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

299       country: session?.country,
          ~~~~~~~

  server/services/analyticsService.ts:41:3
    41   country?: string;
         ~~~~~~~
    The expected type comes from property 'country' which is declared here on type 'TrackActivityData'

server/middleware/visitorTracking.ts:300:7 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

300       deviceType: session?.deviceType,
          ~~~~~~~~~~

  server/services/analyticsService.ts:42:3
    42   deviceType?: string;
         ~~~~~~~~~~
    The expected type comes from property 'deviceType' which is declared here on type 'TrackActivityData'

server/middleware/visitorTracking.ts:301:7 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

301       referrer: session?.referrer,
          ~~~~~~~~

  server/services/analyticsService.ts:43:3
    43   referrer?: string;
         ~~~~~~~~
    The expected type comes from property 'referrer' which is declared here on type 'TrackActivityData'

server/middleware/visitorTracking.ts:302:7 - error TS2322: Type 'string | null | undefined' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

302       userAgent: session?.userAgent
          ~~~~~~~~~

  server/services/analyticsService.ts:44:3
    44   userAgent?: string;
         ~~~~~~~~~
    The expected type comes from property 'userAgent' which is declared here on type 'TrackActivityData'

server/middleware/visitorTracking.ts:531:25 - error TS2802: Type 'MapIterator<VisitorSession>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

531   for (const session of activeSessions.values()) {
                            ~~~~~~~~~~~~~~~~~~~~~~~

server/middleware/visitorTracking.ts:621:9 - error TS2353: Object literal may only specify known properties, and 'activities' does not exist in type 'VisitorAnalyticsInclude<DefaultArgs>'.

621         activities: {
            ~~~~~~~~~~

server/middleware/visitorTracking.ts:740:56 - error TS2353: Object literal may only specify known properties, and 'countryCode' does not exist in type 'VisitorAnalyticsSelect<DefaultArgs>'.

740       select: { id: true, userId: true, country: true, countryCode: true }       
                                                           ~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:39176:5
    39176     select?: VisitorAnalyticsSelect<ExtArgs> | null
              ~~~~~~
    The expected type comes from property 'select' which is declared here on type '{ select?: VisitorAnalyticsSelect<DefaultArgs> | null | undefined; omit?: VisitorAnalyticsOmit<DefaultArgs> | null | undefined; include?: VisitorAnalyticsInclude<...> | ... 1 more ... | undefined; where: VisitorAnalyticsWhereUniqueInput; }'

server/middleware/visitorTracking.ts:749:9 - error TS2322: Type 'string | null' is not assignable to type 'string | undefined'.
  Type 'null' is not assignable to type 'string | undefined'.

749         userId: session.userId,
            ~~~~~~

  server/services/analyticsService.ts:25:3
    25   userId?: string;
         ~~~~~~
    The expected type comes from property 'userId' which is declared here on type 'TrackActivityData'

server/middleware/visitorTracking.ts:762:38 - error TS2339: Property 'countryCode' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'.

762       if (session.country && session.countryCode) {
                                         ~~~~~~~~~~~

server/middleware/visitorTracking.ts:763:66 - error TS2339: Property 'countryCode' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'.

763         await updateGeographicDownloads(session.country, session.countryCode, downloadData.templateType);
                                                                     ~~~~~~~~~~~     

server/routes.ts:114:15 - error TS2322: Type 'JsonValue' is not assignable to type 'NullableJsonNullValueInput | InputJsonValue | undefined'.
  Type 'null' is not assignable to type 'NullableJsonNullValueInput | InputJsonValue | undefined'.

114               billingAddress: order.billingAddress,
                  ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:53101:5
    53101     billingAddress?: NullableJsonNullValueInput | InputJsonValue
              ~~~~~~~~~~~~~~
    The expected type comes from property 'billingAddress' which is declared here on type '(Without<InvoiceCreateInput, InvoiceUncheckedCreateInput> & InvoiceUncheckedCreateInput) | (Without<...> & InvoiceCreateInput)'

server/routes.ts:260:15 - error TS18047: 'order.billingAddress' is possibly 'null'.  

260             ${order.billingAddress.company ? `<p>${order.billingAddress.company}</p>` : ''}
                  ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:260:36 - error TS2339: Property 'company' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'company' does not exist on type 'string'.

260             ${order.billingAddress.company ? `<p>${order.billingAddress.company}</p>` : ''}
                                       ~~~~~~~

server/routes.ts:260:52 - error TS18047: 'order.billingAddress' is possibly 'null'.  

260             ${order.billingAddress.company ? `<p>${order.billingAddress.company}</p>` : ''}
                                                       ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:260:73 - error TS2339: Property 'company' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'company' does not exist on type 'string'.

260             ${order.billingAddress.company ? `<p>${order.billingAddress.company}</p>` : ''}
                                                                            ~~~~~~~  

server/routes.ts:261:18 - error TS18047: 'order.billingAddress' is possibly 'null'.  

261             <p>${order.billingAddress.address}</p>
                     ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:261:39 - error TS2339: Property 'address' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'address' does not exist on type 'string'.

261             <p>${order.billingAddress.address}</p>
                                          ~~~~~~~

server/routes.ts:262:18 - error TS18047: 'order.billingAddress' is possibly 'null'.  

262             <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
                     ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:262:39 - error TS2339: Property 'city' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'city' does not exist on type 'string'.

262             <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
                                          ~~~~

server/routes.ts:262:48 - error TS18047: 'order.billingAddress' is possibly 'null'.  

262             <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
                                                   ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:262:69 - error TS2339: Property 'state' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'state' does not exist on type 'string'.

262             <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
                                                                        ~~~~~        

server/routes.ts:262:78 - error TS18047: 'order.billingAddress' is possibly 'null'.  

262             <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
                                                                                 ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:262:99 - error TS2339: Property 'zipCode' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'zipCode' does not exist on type 'string'.

262             <p>${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}</p>
                                                                                     
                 ~~~~~~~

server/routes.ts:263:18 - error TS18047: 'order.billingAddress' is possibly 'null'.  

263             <p>${order.billingAddress.country}</p>
                     ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:263:39 - error TS2339: Property 'country' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'country' does not exist on type 'string'.

263             <p>${order.billingAddress.country}</p>
                                          ~~~~~~~

server/routes.ts:265:25 - error TS18047: 'order.billingAddress' is possibly 'null'.  

265             <p>Phone: ${order.billingAddress.phone}</p>
                            ~~~~~~~~~~~~~~~~~~~~

server/routes.ts:265:46 - error TS2339: Property 'phone' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'phone' does not exist on type 'string'.

265             <p>Phone: ${order.billingAddress.phone}</p>
                                                 ~~~~~

server/routes.ts:277:17 - error TS18047: 'order.invoice.items' is possibly 'null'.   

277               ${order.invoice.items.map((item: any) => `
                    ~~~~~~~~~~~~~~~~~~~

server/routes.ts:277:37 - error TS2339: Property 'map' does not exist on type 'string | number | boolean | JsonObject | JsonArray'.
  Property 'map' does not exist on type 'string'.

277               ${order.invoice.items.map((item: any) => `
                                        ~~~

server/routes.ts:336:11 - error TS2561: Object literal may only specify known properties, but 'passwordHash' does not exist in type '(Without<UserCreateInput, UserUncheckedCreateInput> & UserUncheckedCreateInput) | (Without<...> & UserCreateInput)'. Did you mean to write 'password'?

336           passwordHash: validatedData.password, // In production, hash this password
              ~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:5616:5
    5616     data: XOR<UserCreateInput, UserUncheckedCreateInput>
             ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; data: (Without<...> & UserUncheckedCreateInput) | (Without<...> & UserCreateInput); }'

server/routes.ts:343:15 - error TS2339: Property 'passwordHash' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

343       const { passwordHash, ...userResponse } = user;
                  ~~~~~~~~~~~~

server/routes.ts:365:11 - error TS2353: Object literal may only specify known properties, and 'tier' does not exist in type 'UserSelect<DefaultArgs>'.

365           tier: true,
              ~~~~

  node_modules/.prisma/client/index.d.ts:5409:5
    5409     select?: UserSelect<ExtArgs> | null
             ~~~~~~
    The expected type comes from property 'select' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; where: UserWhereUniqueInput; }'

server/routes.ts:423:11 - error TS2353: Object literal may only specify known properties, and 'tier' does not exist in type 'UserSelect<DefaultArgs>'.

423           tier: true,
              ~~~~

  node_modules/.prisma/client/index.d.ts:5656:5
    5656     select?: UserSelect<ExtArgs> | null
             ~~~~~~
    The expected type comes from property 'select' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; data: (Without<...> & UserUncheckedUpdateInput) | (Without<...> & UserUpdateInput); where: UserWhereUniqueInput; }'

server/routes.ts:481:11 - error TS2561: Object literal may only specify known properties, but 'subscriptions' does not exist in type 'UserInclude<DefaultArgs>'. Did you mean to write 'subscription'?

481           subscriptions: {
              ~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:5417:5
    5417     include?: UserInclude<ExtArgs> | null
             ~~~~~~~
    The expected type comes from property 'include' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; where: UserWhereUniqueInput; }'

server/routes.ts:503:15 - error TS2339: Property 'passwordHash' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

503       const { passwordHash, ...userProfile } = user;
                  ~~~~~~~~~~~~

server/routes.ts:541:11 - error TS2353: Object literal may only specify known properties, and 'phone' does not exist in type 'UserSelect<DefaultArgs>'.

541           phone: true,
              ~~~~~

  node_modules/.prisma/client/index.d.ts:5656:5
    5656     select?: UserSelect<ExtArgs> | null
             ~~~~~~
    The expected type comes from property 'select' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; data: (Without<...> & UserUncheckedUpdateInput) | (Without<...> & UserUpdateInput); where: UserWhereUniqueInput; }'

server/routes.ts:581:11 - error TS2561: Object literal may only specify known properties, but 'template' does not exist in type 'ResumeSelect<DefaultArgs>'. Did you mean to write 'templateId'?

581           template: {
              ~~~~~~~~

server/routes.ts:617:18 - error TS2322: Type 'string' is not assignable to type 'number'.

617         where: { id: validatedData.templateId }
                     ~~

  node_modules/.prisma/client/index.d.ts:47986:5
    47986     id?: number
              ~~
    The expected type comes from property 'id' which is declared here on type 'TemplateWhereUniqueInput'

server/routes.ts:633:11 - error TS2353: Object literal may only specify known properties, and 'template' does not exist in type 'ResumeInclude<DefaultArgs>'.

633           template: {
              ~~~~~~~~

  node_modules/.prisma/client/index.d.ts:15392:5
    15392     include?: ResumeInclude<ExtArgs> | null
              ~~~~~~~
    The expected type comes from property 'include' which is declared here on type '{ select?: ResumeSelect<DefaultArgs> | null | undefined; omit?: ResumeOmit<DefaultArgs> | null | undefined; include?: ResumeInclude<DefaultArgs> | null | undefined; data: (Without<...> & ResumeUncheckedCreateInput) | (Without<...> & ResumeCreateInput); }' 

server/routes.ts:661:11 - error TS2353: Object literal may only specify known properties, and 'template' does not exist in type 'ResumeInclude<DefaultArgs>'.

661           template: true,
              ~~~~~~~~

  node_modules/.prisma/client/index.d.ts:15197:5
    15197     include?: ResumeInclude<ExtArgs> | null
              ~~~~~~~
    The expected type comes from property 'include' which is declared here on type '{ select?: ResumeSelect<DefaultArgs> | null | undefined; omit?: ResumeOmit<DefaultArgs> | null | undefined; include?: ResumeInclude<DefaultArgs> | null | undefined; where: ResumeWhereUniqueInput; }'

server/routes.ts:723:11 - error TS2353: Object literal may only specify known properties, and 'template' does not exist in type 'ResumeInclude<DefaultArgs>'.

723           template: {
              ~~~~~~~~

  node_modules/.prisma/client/index.d.ts:15448:5
    15448     include?: ResumeInclude<ExtArgs> | null
              ~~~~~~~
    The expected type comes from property 'include' which is declared here on type '{ select?: ResumeSelect<DefaultArgs> | null | undefined; omit?: ResumeOmit<DefaultArgs> | null | undefined; include?: ResumeInclude<DefaultArgs> | null | undefined; data: (Without<...> & ResumeUncheckedUpdateInput) | (Without<...> & ResumeUpdateInput); where: ResumeWhereUniqueInput; }'

server/routes.ts:803:11 - error TS2322: Type 'JsonValue' is not assignable to type 'JsonNull | InputJsonValue'.
  Type 'null' is not assignable to type 'JsonNull | InputJsonValue'.

803           content: originalResume.content,
              ~~~~~~~

  node_modules/.prisma/client/index.d.ts:51224:5
    51224     content: JsonNullValueInput | InputJsonValue
              ~~~~~~~
    The expected type comes from property 'content' which is declared here on type '(Without<ResumeCreateInput, ResumeUncheckedCreateInput> & ResumeUncheckedCreateInput) | (Without<...> & ResumeCreateInput)'

server/routes.ts:807:11 - error TS2353: Object literal may only specify known properties, and 'template' does not exist in type 'ResumeInclude<DefaultArgs>'.

807           template: {
              ~~~~~~~~

  node_modules/.prisma/client/index.d.ts:15392:5
    15392     include?: ResumeInclude<ExtArgs> | null
              ~~~~~~~
    The expected type comes from property 'include' which is declared here on type '{ select?: ResumeSelect<DefaultArgs> | null | undefined; omit?: ResumeOmit<DefaultArgs> | null | undefined; include?: ResumeInclude<DefaultArgs> | null | undefined; data: (Without<...> & ResumeUncheckedCreateInput) | (Without<...> & ResumeCreateInput); }' 

server/routes.ts:957:18 - error TS2322: Type 'string' is not assignable to type 'number'.

957         where: { id },
                     ~~

  node_modules/.prisma/client/index.d.ts:47986:5
    47986     id?: number
              ~~
    The expected type comes from property 'id' which is declared here on type 'TemplateWhereUniqueInput'

server/routes.ts:1037:18 - error TS2322: Type 'string' is not assignable to type 'number'.

1037         where: { id }
                      ~~

  node_modules/.prisma/client/index.d.ts:47986:5
    47986     id?: number
              ~~
    The expected type comes from property 'id' which is declared here on type 'TemplateWhereUniqueInput'

server/routes.ts:1045:18 - error TS2322: Type 'string' is not assignable to type 'number'.

1045         where: { id },
                      ~~

  node_modules/.prisma/client/index.d.ts:47986:5
    47986     id?: number
              ~~
    The expected type comes from property 'id' which is declared here on type 'TemplateWhereUniqueInput'

server/routes.ts:1066:18 - error TS2322: Type 'string' is not assignable to type 'number'.

1066         where: { id }
                      ~~

  node_modules/.prisma/client/index.d.ts:47986:5
    47986     id?: number
              ~~
    The expected type comes from property 'id' which is declared here on type 'TemplateWhereUniqueInput'

server/routes.ts:1076:18 - error TS2322: Type 'string' is not assignable to type 'number'.

1076         where: { id }
                      ~~

  node_modules/.prisma/client/index.d.ts:47986:5
    47986     id?: number
              ~~
    The expected type comes from property 'id' which is declared here on type 'TemplateWhereUniqueInput'

server/routes.ts:1252:43 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1252       const usageStatistic = await prisma.usageStatistic.create({
                                               ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1319:11 - error TS2353: Object literal may only specify known properties, and '_count' does not exist in type 'TemplateSelect<DefaultArgs>'.

1319           _count: {
               ~~~~~~

server/routes.ts:1326:11 - error TS2353: Object literal may only specify known properties, and 'resumes' does not exist in type 'TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]'.

1326           resumes: {
               ~~~~~~~

server/routes.ts:1334:39 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1334       const usageStats = await prisma.usageStatistic.groupBy({
                                           ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1393:38 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1393       const userStats = await prisma.usageStatistic.groupBy({
                                          ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1437:20 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1437       await prisma.usageStatistic.create({
                        ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1461:20 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1461       await prisma.usageStatistic.create({
                        ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1485:20 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1485       await prisma.usageStatistic.create({
                        ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1509:20 - error TS2551: Property 'usageStatistic' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

1509       await prisma.usageStatistic.create({
                        ~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:1563:17 - error TS2353: Object literal may only specify known properties, and 'subscriptions' does not exist in type 'UserCountOutputTypeSelect<DefaultArgs>'.

1563                 subscriptions: true
                     ~~~~~~~~~~~~~

server/routes.ts:1604:15 - error TS2561: Object literal may only specify known properties, but 'template' does not exist in type 'ResumeSelect<DefaultArgs>'. Did you mean to write 'templateId'?

1604               template: {
                   ~~~~~~~~

server/routes.ts:1665:15 - error TS2339: Property 'passwordHash' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

1665       const { passwordHash, ...userDetails } = user;
                   ~~~~~~~~~~~~

server/routes.ts:1693:17 - error TS2353: Object literal may only specify known properties, and 'tier' does not exist in type '(Without<UserUpdateInput, UserUncheckedUpdateInput> & UserUncheckedUpdateInput) | (Without<...> & UserUpdateInput)'.

1693         data: { tier: validatedTier },
                     ~~~~

  node_modules/.prisma/client/index.d.ts:5668:5
    5668     data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
             ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; data: (Without<...> & UserUncheckedUpdateInput) | (Without<...> & UserUpdateInput); where: UserWhereUniqueInput; }'

server/routes.ts:1698:11 - error TS2353: Object literal may only specify known properties, and 'tier' does not exist in type 'UserSelect<DefaultArgs>'.

1698           tier: true,
               ~~~~

  node_modules/.prisma/client/index.d.ts:5656:5
    5656     select?: UserSelect<ExtArgs> | null
             ~~~~~~
    The expected type comes from property 'select' which is declared here on type '{ select?: UserSelect<DefaultArgs> | null | undefined; omit?: UserOmit<DefaultArgs> | null | undefined; include?: UserInclude<DefaultArgs> | null | undefined; data: (Without<...> & UserUncheckedUpdateInput) | (Without<...> & UserUpdateInput); where: UserWhereUniqueInput; }'

server/routes.ts:1745:13 - error TS2322: Type '"tier"[]' is not assignable to type 'UserScalarFieldEnum | UserScalarFieldEnum[]'.
  Type '"tier"[]' is not assignable to type 'UserScalarFieldEnum[]'.
    Type '"tier"' is not assignable to type 'UserScalarFieldEnum'.

1745             by: ['tier'],
                 ~~

  node_modules/.prisma/client/index.d.ts:4683:5
    4683     by: UserScalarFieldEnum[] | UserScalarFieldEnum
             ~~
    The expected type comes from property 'by' which is declared here on type '{ where?: UserWhereInput | undefined; orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[] | undefined; ... 6 more ...; _max?: UserMaxAggregateInputType | undefined; } & { ...; }'

server/routes.ts:1746:23 - error TS2353: Object literal may only specify known properties, and 'tier' does not exist in type 'UserCountAggregateInputType'.

1746             _count: { tier: true }
                           ~~~~

  node_modules/.prisma/client/index.d.ts:4687:5
    4687     _count?: UserCountAggregateInputType | true
             ~~~~~~
    The expected type comes from property '_count' which is declared here on type '{ where?: UserWhereInput | undefined; orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[] | undefined; ... 6 more ...; _max?: UserMaxAggregateInputType | undefined; } & { ...; }'

server/routes.ts:1760:44 - error TS2353: Object literal may only specify known properties, and 'isActive' does not exist in type 'TemplateWhereInput'.

1760           prisma.template.count({ where: { isActive: true } }),
                                                ~~~~~~~~

server/routes.ts:1765:15 - error TS2353: Object literal may only specify known properties, and 'category' does not exist in type 'TemplateSelect<DefaultArgs>'.

1765               category: true,
                   ~~~~~~~~

server/routes.ts:1773:15 - error TS2353: Object literal may only specify known properties, and 'resumes' does not exist in type 'TemplateOrderByWithRelationInput | TemplateOrderByWithRelationInput[]'.

1773               resumes: {
                   ~~~~~~~

server/routes.ts:1931:9 - error TS2322: Type '{ message: string; type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"; title: string; userId: string; actionUrl?: string | undefined; }' is not assignable to type '(Without<NotificationCreateInput, NotificationUncheckedCreateInput> & NotificationUncheckedCreateInput) | (Without<...> & NotificationCreateInput)'.
  Type '{ message: string; type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"; title: string; userId: string; actionUrl?: string | undefined; }' is not assignable to type 'Without<NotificationCreateInput, NotificationUncheckedCreateInput> & NotificationUncheckedCreateInput'.
    Type '{ message: string; type: "INFO" | "SUCCESS" | "WARNING" | "ERROR"; title: string; userId: string; actionUrl?: string | undefined; }' is not assignable to type 'NotificationUncheckedCreateInput'.
      Types of property 'type' are incompatible.
        Type '"INFO" | "SUCCESS" | "WARNING" | "ERROR"' is not assignable to type 'NotificationType'.
          Type '"INFO"' is not assignable to type 'NotificationType'.

1931         data: validatedData
             ~~~~

  node_modules/.prisma/client/index.d.ts:13145:5
    13145     data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>   
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: NotificationSelect<DefaultArgs> | null | undefined; omit?: NotificationOmit<DefaultArgs> | null | undefined; include?: NotificationInclude<...> | ... 1 more ... | undefined; data: (Without<...> & NotificationUncheckedCreateInput) | (Without<...> & NotificationCreateInput); }'

server/routes.ts:2226:11 - error TS2820: Type '"CANCELLED"' is not assignable to type 'SubscriptionStatus | EnumSubscriptionStatusFieldUpdateOperationsInput | undefined'. Did you mean '"CANCELED"'?

2226           status: 'CANCELLED',
               ~~~~~~

  node_modules/.prisma/client/index.d.ts:50714:5
    50714     status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
              ~~~~~~
    The expected type comes from property 'status' which is declared here on type '(Without<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput> & SubscriptionUncheckedUpdateManyInput) | (Without<...> & SubscriptionUpdateManyMutationInput)'

server/routes.ts:2234:11 - error TS2353: Object literal may only specify known properties, and 'startDate' does not exist in type 'Without<SubscriptionCreateInput, SubscriptionUncheckedCreateInput> & SubscriptionUncheckedCreateInput'.

2234           startDate: new Date(validatedData.startDate),
               ~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:8517:5
    8517     data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>    
             ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: SubscriptionSelect<DefaultArgs> | null | undefined; omit?: SubscriptionOmit<DefaultArgs> | null | undefined; include?: SubscriptionInclude<...> | ... 1 more ... | undefined; data: (Without<...> & SubscriptionUncheckedCreateInput) | (Without<...> & SubscriptionCreateInput); }'

server/routes.ts:2311:11 - error TS2820: Type '"CANCELLED"' is not assignable to type 'SubscriptionStatus | EnumSubscriptionStatusFieldUpdateOperationsInput | undefined'. Did you mean '"CANCELED"'?

2311           status: 'CANCELLED',
               ~~~~~~

  node_modules/.prisma/client/index.d.ts:50647:5
    50647     status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
              ~~~~~~
    The expected type comes from property 'status' which is declared here on type '(Without<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput> & SubscriptionUncheckedUpdateInput) | (Without<...> & SubscriptionUpdateInput)'

server/routes.ts:2350:24 - error TS2339: Property 'expiresAt' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2350       if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {      
                            ~~~~~~~~~

server/routes.ts:2350:63 - error TS2339: Property 'expiresAt' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2350       if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {      
                                                                   ~~~~~~~~~

server/routes.ts:2355:24 - error TS2339: Property 'maxUses' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2355       if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
                            ~~~~~~~

server/routes.ts:2355:48 - error TS2551: Property 'usedCount' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'. Did you mean 'usageCount'?    

2355       if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
                                                    ~~~~~~~~~

server/routes.ts:2355:74 - error TS2339: Property 'maxUses' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2355       if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
                                                                              ~~~~~~~

server/routes.ts:2360:34 - error TS2339: Property 'maxUsesPerUser' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2360       if (userId && discountCode.maxUsesPerUser) {
                                      ~~~~~~~~~~~~~~

server/routes.ts:2368:44 - error TS2339: Property 'maxUsesPerUser' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2368         if (userUsageCount >= discountCode.maxUsesPerUser) {
                                                ~~~~~~~~~~~~~~

server/routes.ts:2378:38 - error TS2339: Property 'discountType' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2378           discountType: discountCode.discountType,
                                          ~~~~~~~~~~~~

server/routes.ts:2379:39 - error TS2339: Property 'discountValue' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2379           discountValue: discountCode.discountValue,
                                           ~~~~~~~~~~~~~

server/routes.ts:2417:11 - error TS2353: Object literal may only specify known properties, and 'orderId' does not exist in type 'Without<DiscountCodeUsageCreateInput, DiscountCodeUsageUncheckedCreateInput> & DiscountCodeUsageUncheckedCreateInput'.        

2417           orderId,
               ~~~~~~~

  node_modules/.prisma/client/index.d.ts:31858:5
    31858     data: XOR<DiscountCodeUsageCreateInput, DiscountCodeUsageUncheckedCreateInput>
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: DiscountCodeUsageSelect<DefaultArgs> | null | undefined; omit?: DiscountCodeUsageOmit<DefaultArgs> | null | undefined; include?: DiscountCodeUsageInclude<...> | ... 1 more ... | undefined; data: (Without<...> & DiscountCodeUsageUncheckedCreateInput) | (Without<...> & DiscountCodeUsageCreateInput); }'

server/routes.ts:2426:11 - error TS2561: Object literal may only specify known properties, but 'usedCount' does not exist in type '(Without<DiscountCodeUpdateInput, DiscountCodeUncheckedUpdateInput> & DiscountCodeUncheckedUpdateInput) | (Without<...> & DiscountCodeUpdateInput)'. Did you mean to write 'usageCount'?

2426           usedCount: {
               ~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:30725:5
    30725     data: XOR<DiscountCodeUpdateInput, DiscountCodeUncheckedUpdateInput>   
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: DiscountCodeSelect<DefaultArgs> | null | undefined; omit?: DiscountCodeOmit<DefaultArgs> | null | undefined; include?: DiscountCodeInclude<...> | ... 1 more ... | undefined; data: (Without<...> & DiscountCodeUncheckedUpdateInput) | (Without<...> & DiscountCodeUpdateInput); where: DiscountCodeWhereUniqueIn...'

server/routes.ts:2438:38 - error TS2339: Property 'discountType' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2438           discountType: discountCode.discountType,
                                          ~~~~~~~~~~~~

server/routes.ts:2439:39 - error TS2339: Property 'discountValue' does not exist on type '{ value: number; code: string; type: DiscountType; id: string; name: string; description: string | null; isActive: boolean; createdAt: Date; updatedAt: Date; minAmount: number | null; ... 6 more ...; usageCount: number; }'.

2439           discountValue: discountCode.discountValue
                                           ~~~~~~~~~~~~~

server/routes.ts:2479:11 - error TS2353: Object literal may only specify known properties, and 'expiresAt' does not exist in type '(Without<DiscountCodeCreateInput, DiscountCodeUncheckedCreateInput> & DiscountCodeUncheckedCreateInput) | (Without<...> & DiscountCodeCreateInput)'.

2479           expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
               ~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:30673:5
    30673     data: XOR<DiscountCodeCreateInput, DiscountCodeUncheckedCreateInput>   
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: DiscountCodeSelect<DefaultArgs> | null | undefined; omit?: DiscountCodeOmit<DefaultArgs> | null | undefined; include?: DiscountCodeInclude<...> | ... 1 more ... | undefined; data: (Without<...> & DiscountCodeUncheckedCreateInput) | (Without<...> & DiscountCodeCreateInput); }'

server/routes.ts:2528:37 - error TS2339: Property 'downloadTracking' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

2528       const download = await prisma.downloadTracking.create({
                                         ~~~~~~~~~~~~~~~~

server/routes.ts:2536:20 - error TS2551: Property 'usageStatistics' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'. Did you mean 'usageStats'?

2536       await prisma.usageStatistics.create({
                        ~~~~~~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:548:7
    548   get usageStats(): Prisma.UsageStatsDelegate<ExtArgs, ClientOptions>;       
              ~~~~~~~~~~
    'usageStats' is declared here.

server/routes.ts:2568:16 - error TS2339: Property 'downloadTracking' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

2568         prisma.downloadTracking.findMany({
                    ~~~~~~~~~~~~~~~~

server/routes.ts:2582:16 - error TS2339: Property 'downloadTracking' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

2582         prisma.downloadTracking.count({ where: whereClause })
                    ~~~~~~~~~~~~~~~~

server/routes.ts:2632:16 - error TS2339: Property 'downloadTracking' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

2632         prisma.downloadTracking.count({ where: whereClause }),
                    ~~~~~~~~~~~~~~~~

server/routes.ts:2633:16 - error TS2339: Property 'downloadTracking' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

2633         prisma.downloadTracking.groupBy({
                    ~~~~~~~~~~~~~~~~

server/routes.ts:2638:16 - error TS2339: Property 'downloadTracking' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

2638         prisma.downloadTracking.groupBy({
                    ~~~~~~~~~~~~~~~~

server/routes.ts:2674:13 - error TS2353: Object literal may only specify known properties, and 'orderBy' does not exist in type 'User$subscriptionArgs<DefaultArgs>'.     

2674             orderBy: { createdAt: 'desc' },
                 ~~~~~~~

server/routes.ts:2685:39 - error TS2551: Property 'subscription' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'. Did you mean 'subscriptionId'?

2685       const activeSubscription = user.subscription[0];
                                           ~~~~~~~~~~~~

server/routes.ts:2686:29 - error TS2339: Property 'tier' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

2686       const userTier = user.tier || 'FREE';
                                 ~~~~

server/routes.ts:2698:23 - error TS2339: Property 'tier' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

2698         isAdmin: user.tier === 'ADMIN'
                           ~~~~

server/routes.ts:2739:13 - error TS2353: Object literal may only specify known properties, and 'orderBy' does not exist in type 'User$subscriptionArgs<DefaultArgs>'.     

2739             orderBy: { createdAt: 'desc' },
                 ~~~~~~~

server/routes.ts:2749:39 - error TS2551: Property 'subscription' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'. Did you mean 'subscriptionId'?

2749       const activeSubscription = user.subscription[0];
                                           ~~~~~~~~~~~~

server/routes.ts:2750:61 - error TS2339: Property 'tier' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

2750       const planType = activeSubscription?.planType || user.tier || 'FREE';     
                                                                 ~~~~

server/routes.ts:2778:32 - error TS2339: Property 'tier' does not exist on type '{ email: string; password: string | null; title: string | null; id: string; role: UserRole; name: string | null; location: string | null; isActive: boolean; createdAt: Date; ... 16 more ...; subscriptionEndsAt: Date | null; }'.

2778           hasPermission = user.tier === 'ADMIN';
                                    ~~~~

server/routes/analytics-simple.ts:159:9 - error TS2353: Object literal may only specify known properties, and 'activities' does not exist in type 'VisitorAnalyticsInclude<DefaultArgs>'.

159         activities: {
            ~~~~~~~~~~

  node_modules/.prisma/client/index.d.ts:39184:5
    39184     include?: VisitorAnalyticsInclude<ExtArgs> | null
              ~~~~~~~
    The expected type comes from property 'include' which is declared here on type '{ select?: VisitorAnalyticsSelect<DefaultArgs> | null | undefined; omit?: VisitorAnalyticsOmit<DefaultArgs> | null | undefined; include?: VisitorAnalyticsInclude<...> | ... 1 more ... | undefined; where: VisitorAnalyticsWhereUniqueInput; }'

server/routes/analytics-simple.ts:257:9 - error TS2353: Object literal may only specify known properties, and 'activities' does not exist in type 'VisitorAnalyticsInclude<DefaultArgs>'.

257         activities: {
            ~~~~~~~~~~

server/routes/analytics-simple.ts:296:33 - error TS2339: Property 'activities' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'. 

296         totalDownloads: session.activities.length,
                                    ~~~~~~~~~~

server/routes/analytics-simple.ts:297:32 - error TS2339: Property 'activities' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'. 

297         snapDownloads: session.activities.filter(a => a.templateType === 'snap').length,
                                   ~~~~~~~~~~

server/routes/analytics-simple.ts:297:50 - error TS7006: Parameter 'a' implicitly has an 'any' type.

297         snapDownloads: session.activities.filter(a => a.templateType === 'snap').length,
                                                     ~

server/routes/analytics-simple.ts:298:31 - error TS2339: Property 'activities' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'. 

298         proDownloads: session.activities.filter(a => a.templateType === 'pro').length,
                                  ~~~~~~~~~~

server/routes/analytics-simple.ts:298:49 - error TS7006: Parameter 'a' implicitly has an 'any' type.

298         proDownloads: session.activities.filter(a => a.templateType === 'pro').length,
                                                    ~

server/routes/analytics-simple.ts:299:34 - error TS2339: Property 'activities' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'. 

299         recentDownloads: session.activities.map(a => a.templateName).slice(0, 3) 
                                     ~~~~~~~~~~

server/routes/analytics-simple.ts:299:49 - error TS7006: Parameter 'a' implicitly has an 'any' type.

299         recentDownloads: session.activities.map(a => a.templateName).slice(0, 3) 
                                                    ~

server/routes/analytics.ts:14:43 - error TS2554: Expected 0 arguments, but got 1.    

14   analyticsService = new AnalyticsService(prisma);
                                             ~~~~~~

server/routes/analytics.ts:40:69 - error TS2554: Expected 0-1 arguments, but got 2.  

40     const data = await analyticsService.getDashboardData(startDate, endDate);     
                                                                       ~~~~~~~       

server/routes/analytics.ts:196:31 - error TS2694: Namespace '"C:/Users/mhdtb/OneDrive/Desktop/trae+replitV1/TbzResumeBuilderV4/node_modules/.prisma/client/index".Prisma' has no exported member 'ActivityLogWhereInput'.

196     const whereClause: Prisma.ActivityLogWhereInput = {};
                                  ~~~~~~~~~~~~~~~~~~~~~

server/routes/analytics.ts:481:14 - error TS2339: Property 'sessionId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.

481     if (!req.sessionId || !req.visitorId) {
                 ~~~~~~~~~

server/routes/analytics.ts:481:32 - error TS2339: Property 'visitorId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.

481     if (!req.sessionId || !req.visitorId) {
                                   ~~~~~~~~~

server/routes/analytics.ts:486:22 - error TS2339: Property 'sessionId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.

486       sessionId: req.sessionId,
                         ~~~~~~~~~

server/routes/analytics.ts:487:22 - error TS2339: Property 'visitorId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'.

487       visitorId: req.visitorId,
                         ~~~~~~~~~

server/routes/analytics.ts:488:19 - error TS2551: Property 'userId' does not exist on type 'Request<{}, any, any, ParsedQs, Record<string, any>>'. Did you mean 'user'?   

488       userId: req.userId,
                      ~~~~~~

  server/routes.ts:20:7
    20       user?: any;
             ~~~~
    'user' is declared here.

server/routes/analytics.ts:535:9 - error TS2353: Object literal may only specify known properties, and 'timestamp' does not exist in type 'VisitorAnalyticsWhereInput'.   

535         timestamp: {
            ~~~~~~~~~

server/routes/analytics.ts:543:9 - error TS2353: Object literal may only specify known properties, and 'timestamp' does not exist in type 'VisitorAnalyticsWhereInput'.   

543         timestamp: {
            ~~~~~~~~~

server/routes/import-history.ts:45:13 - error TS2339: Property 'uploadedBy' does not exist on type 'ImportHistoryWhereInput'.

45       where.uploadedBy = uploadedBy;
               ~~~~~~~~~~

server/routes/template-download-enhanced.ts:26:27 - error TS2551: Property 'userId' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'. Did you mean 'user'?

26     req.body.userId = req.userId;
                             ~~~~~~

  server/routes.ts:20:7
    20       user?: any;
             ~~~~
    'user' is declared here.

server/routes/template-download-enhanced.ts:35:21 - error TS2551: Property 'userId' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'. Did you mean 'user'?

35         userId: req.userId,
                       ~~~~~~

  server/routes.ts:20:7
    20       user?: any;
             ~~~~
    'user' is declared here.

server/services/analyticsService.ts:280:60 - error TS2345: Argument of type '{ userTier: string | undefined; country: string | undefined; deviceType: string | undefined; sessionId: string; visitorId: string; userId?: string; activityType: string; activityName: string; ... 13 more ...; userAgent?: string; }' is not assignable to parameter of type '{ sessionId: string; userId?: string | undefined; activityType: string; activityName: string; description?: string | undefined; metadata?: Record<string, any> | undefined; templateId?: string | undefined; ... 9 more ...; errorMessage?: string | undefined; }'.
  Types of property 'templateType' are incompatible.
    Type 'string | undefined' is not assignable to type '"pro" | "snap" | undefined'.
      Type 'string' is not assignable to type '"pro" | "snap" | undefined'.

280       const memoryActivity = memoryAnalytics.trackActivity(enhancedData);        
                                                               ~~~~~~~~~~~~

server/services/analyticsService.ts:488:71 - error TS2339: Property 'countryCode' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'.

488         await this.updateGeographicDownloads(visitor.country, visitor.countryCode || 'XX', data.templateType);
                                                                          ~~~~~~~~~~~

server/services/analyticsService.ts:526:75 - error TS2339: Property 'countryCode' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'.

526         await this.updateGeographicRegistrations(visitor.country, visitor.countryCode || 'XX');
                                                                              ~~~~~~~~~~~

server/services/analyticsService.ts:556:75 - error TS2339: Property 'countryCode' does not exist on type '{ id: string; region: string | null; country: string | null; createdAt: Date; updatedAt: Date; city: string | null; sessionId: string; userId: string | null; ipAddress: string | null; ... 13 more ...; sessionDuration: number | null; }'.

556         await this.updateGeographicSubscriptions(visitor.country, visitor.countryCode || 'XX');
                                                                              ~~~~~~~~~~~

server/services/analyticsService.ts:800:37 - error TS2339: Property 'prisma' does not exist on type 'AnalyticsService'.

800         totalVisitors = await (this.prisma.visitorAnalytics as any).count({      
                                        ~~~~~~

server/services/analyticsService.ts:803:39 - error TS2339: Property 'prisma' does not exist on type 'AnalyticsService'.

803         registeredUsers = await (this.prisma.visitorAnalytics as any).count({    
                                          ~~~~~~

server/services/analyticsService.ts:949:50 - error TS7006: Parameter 'template' implicitly has an 'any' type.

949       const topTemplates = templateDownloads.map(template => ({
                                                     ~~~~~~~~

server/services/analyticsService.ts:1073:37 - error TS2339: Property 'timestamp' does not exist on type '{ createdAt: { gte: Date; lte: Date; }; }'.

1073           downloadedAt: whereClause.timestamp || whereClause.createdAt
                                         ~~~~~~~~~

server/services/analyticsService.ts:1080:37 - error TS2339: Property 'timestamp' does not exist on type '{ createdAt: { gte: Date; lte: Date; }; }'.

1080           downloadedAt: whereClause.timestamp || whereClause.createdAt
                                         ~~~~~~~~~

server/services/analyticsService.ts:1086:34 - error TS2339: Property 'timestamp' does not exist on type '{ createdAt: { gte: Date; lte: Date; }; }'.

1086           createdAt: whereClause.timestamp || whereClause.createdAt
                                      ~~~~~~~~~

server/services/analyticsService.ts:1134:54 - error TS2554: Expected 0 arguments, but got 1.

1134 export const analyticsService = new AnalyticsService(prisma);
                                                          ~~~~~~

server/services/memoryAnalyticsService.ts:91:34 - error TS2802: Type 'MapIterator<[string, ActivityEvent]>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

91     for (const [id, activity] of this.activities.entries()) {
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~

server/services/memoryAnalyticsService.ts:98:40 - error TS2802: Type 'MapIterator<[string, VisitorSession]>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

98     for (const [sessionId, session] of this.sessions.entries()) {
                                          ~~~~~~~~~~~~~~~~~~~~~~~

server/services/memoryAnalyticsService.ts:105:39 - error TS2802: Type 'MapIterator<[string, TemplateStats]>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

105     for (const [templateId, stats] of this.templateStats.entries()) {
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

server/services/memoryAnalyticsService.ts:112:36 - error TS2802: Type 'MapIterator<[string, CountryStats]>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.

112     for (const [country, stats] of this.countryStats.entries()) {
                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~

server/services/memoryAnalyticsService.ts:342:5 - error TS2322: Type '{ uniqueVisitors: number; templateId: string; templateName: string; templateType: "pro" | "snap"; views: number; downloads: number; lastActivity: number; }[]' is not assignable to type 'TemplateStats[]'.
  Type '{ uniqueVisitors: number; templateId: string; templateName: string; templateType: "snap" | "pro"; views: number; downloads: number; lastActivity: number; }' is not assignable to type 'TemplateStats'.
    Types of property 'uniqueVisitors' are incompatible.
      Type 'number' is not assignable to type 'Set<string>'.

342     return Array.from(this.templateStats.values())
        ~~~~~~


Found 605 errors in 148 files.

Errors  Files
     1  client-admin/src/App.tsx:4
     2  client-admin/src/components/auth/FirebaseProtectedRoute.tsx:28
     1  client-admin/src/components/final-page/EditableSection.tsx:2
     1  client-admin/src/components/final-page/ExportOptions.tsx:48
     7  client-admin/src/components/final-page/FinalPagePreview.tsx:464
     3  client-admin/src/components/final-page/SectionReorderModal.tsx:118
     2  client-admin/src/components/FinalPagePreview.tsx:2
     1  client-admin/src/components/PersonalInfoPreview.tsx:81
     1  client-admin/src/components/ProPreview.tsx:4
     1  client-admin/src/components/resume/ResumePreview.tsx:3
     1  client-admin/src/components/resume/SectionEditor.tsx:3
     1  client-admin/src/components/ResumePreview.tsx:3
     1  client-admin/src/components/SubscriptionUpgrade.tsx:141
     1  client-admin/src/components/templates/TemplatesShowcase.tsx:6
     1  client-admin/src/components/ui/breadcrumb.tsx:51
     7  client-admin/src/components/ui/MobileOptimizationIndicator.tsx:9
     5  client-admin/src/components/ui/sidebar.tsx:446
     2  client-admin/src/lib/auth.ts:2
     6  client-admin/src/lib/export/docx.ts:3
     1  client-admin/src/lib/export/pdf.ts:5
     6  client-admin/src/lib/export/txt.ts:1
    62  client-admin/src/lib/multi-page-template-utils.tsx:143
     1  client-admin/src/pages/Admin/SubscriptionManagement.tsx:316
     8  client-admin/src/pages/Admin/ViewTemplate.tsx:127
     8  client-admin/src/pages/AuthPage.tsx:127
     1  client-admin/src/pages/Dashboard.tsx:584
     6  client-admin/src/pages/JobDescriptionPage.tsx:717
     9  client-admin/src/pages/LoginPage.tsx:202
     1  client-admin/src/pages/PersonalInformationPage.tsx:183
    14  client-admin/src/pages/ResumeBuilder.tsx:11
     4  client-admin/src/pages/SkillsPage.tsx:172
     1  client-admin/src/test-main.tsx:38
     1  client/src/components/admin/AnalyticsDashboard.tsx:24
     3  client/src/components/auth/FirebaseProtectedRoute.tsx:6
     1  client/src/components/features/FeaturesSection.tsx:2
     1  client/src/components/final-page/DesignPanel.tsx:2
     2  client/src/components/final-page/EditableSection.tsx:2
     2  client/src/components/final-page/ExportOptions.tsx:3
     8  client/src/components/final-page/FinalPagePreview.tsx:4
     1  client/src/components/final-page/LeftSidebar.tsx:2
     1  client/src/components/final-page/RightActions.tsx:2
     4  client/src/components/final-page/SectionReorderModal.tsx:22
     1  client/src/components/final-page/SpellCheckPanel.tsx:2
     1  client/src/components/final-page/TemplateSwitcher.tsx:5
     1  client/src/components/final-page/TopBar.tsx:2
     3  client/src/components/FinalPagePreview.tsx:2
     1  client/src/components/layout/Footer.tsx:4
     1  client/src/components/layout/Header.tsx:7
     1  client/src/components/modal/DownloadOptionsModal.tsx:5
     1  client/src/components/modal/ResumePreviewModal.tsx:2
     2  client/src/components/PersonalInfoPreview.tsx:2
     2  client/src/components/ProPreview.tsx:3
     1  client/src/components/resume/ResumePreview.tsx:3
     2  client/src/components/resume/SectionEditor.tsx:3
     1  client/src/components/resume/TemplateSelector.tsx:5
     1  client/src/components/ResumeDataDebugger.tsx:5
     1  client/src/components/ResumePreview.tsx:3
     1  client/src/components/SubscriptionUpgrade.tsx:141
     4  client/src/components/templates/TemplatesShowcase.tsx:4
     1  client/src/components/testimonials/TestimonialsSection.tsx:2
     1  client/src/components/ui/accordion.tsx:3
     1  client/src/components/ui/breadcrumb.tsx:3
     1  client/src/components/ui/calendar.tsx:2
     1  client/src/components/ui/carousel.tsx:5
     1  client/src/components/ui/checkbox.tsx:3
     1  client/src/components/ui/command.tsx:4
     1  client/src/components/ui/context-menu.tsx:3
     1  client/src/components/ui/ContextualTipBar.tsx:3
     1  client/src/components/ui/dialog.tsx:5
     1  client/src/components/ui/dropdown-menu.tsx:3
     1  client/src/components/ui/input-otp.tsx:3
     1  client/src/components/ui/menubar.tsx:5
     8  client/src/components/ui/MobileOptimizationIndicator.tsx:4
     1  client/src/components/ui/navigation-menu.tsx:4
     1  client/src/components/ui/pagination.tsx:2
     1  client/src/components/ui/radio-group.tsx:3
     1  client/src/components/ui/resizable.tsx:4
     1  client/src/components/ui/select.tsx:5
     1  client/src/components/ui/sheet.tsx:6
     1  client/src/components/ui/sidebar.tsx:4
     1  client/src/components/ui/theme-toggle.tsx:4
     1  client/src/components/ui/toast.tsx:4
     3  client/src/hooks/use-auth.ts:2
     2  client/src/lib/auth.ts:2
     6  client/src/lib/export/docx.ts:3
     1  client/src/lib/export/pdf.ts:5
     6  client/src/lib/export/txt.ts:1
     1  client/src/lib/firebase.example.ts:26
    62  client/src/lib/multi-page-template-utils.tsx:143
     2  client/src/lib/queryClient.ts:1
     1  client/src/main.tsx:6
     1  client/src/pages/AddSectionPage.tsx:4
     1  client/src/pages/Admin/AdminProPage.tsx:6
     1  client/src/pages/Admin/AdminSnapPage.tsx:5
     1  client/src/pages/Admin/AdminTierSelectionPage.tsx:11
     1  client/src/pages/Admin/DatabaseManagementPage.tsx:6
     1  client/src/pages/Admin/EditProTemplate.tsx:3
     1  client/src/pages/Admin/EditTemplate.tsx:3
     1  client/src/pages/Admin/ImportHistory.tsx:15
    10  client/src/pages/Admin/ImportHistoryPage.tsx:2
     8  client/src/pages/Admin/JobTitlesManagement.tsx:2
     2  client/src/pages/Admin/ProfessionalSummaryManagement.tsx:2
     2  client/src/pages/Admin/ProTemplateEditor.tsx:8
     4  client/src/pages/Admin/ProTemplatesManagement.tsx:2
     2  client/src/pages/Admin/SkillsManagement.tsx:2
     2  client/src/pages/Admin/SnapTemplateEditor.tsx:8
     2  client/src/pages/Admin/SubscriptionManagement.tsx:27
     3  client/src/pages/Admin/TemplatesManagement.tsx:2
     1  client/src/pages/Admin/UserManagementPage.tsx:18
     2  client/src/pages/Admin/ViewProTemplate.tsx:3
     2  client/src/pages/Admin/ViewTemplate.tsx:3
     1  client/src/pages/CheckoutPage.tsx:18
     3  client/src/pages/Dashboard.tsx:4
     1  client/src/pages/EducationPage.tsx:3
     1  client/src/pages/EducationSummaryPage.tsx:4
     1  client/src/pages/FinalPage.tsx:3
     8  client/src/pages/Home.tsx:5
     7  client/src/pages/JobDescriptionPage.tsx:5
     2  client/src/pages/LoginPage.tsx:28
     1  client/src/pages/not-found.tsx:3
     1  client/src/pages/OrderSuccessPage.tsx:14
     9  client/src/pages/PackageSelection.tsx:4
     3  client/src/pages/PersonalInformationPage.tsx:3
     2  client/src/pages/Preview.tsx:2
     1  client/src/pages/ProfessionalSummaryPage.tsx:3
    21  client/src/pages/ResumeBuilder.tsx:5
     1  client/src/pages/SectionDetailFormPage.tsx:4
     5  client/src/pages/SkillsPage.tsx:13
     1  client/src/pages/SkillsSummaryPage.tsx:3
     3  client/src/pages/TemplatesPage.tsx:4
     1  client/src/pages/TestPreview.tsx:4
     1  client/src/pages/UploadOptionsPage.tsx:4
     1  client/src/pages/WhyNeedResumePage.tsx:3
     1  client/src/pages/WorkExperienceDetailsPage.tsx:3
     1  client/src/pages/WorkHistorySummaryPage.tsx:4
     1  client/src/test-main.tsx:38
     3  server/custom-vite.ts:36
     1  server/db.ts:3
     1  server/index.ts:138
     3  server/middleware/usageLimits.ts:85
    13  server/middleware/visitorTracking.ts:30
    90  server/routes.ts:114
     9  server/routes/analytics-simple.ts:159
    10  server/routes/analytics.ts:14
     1  server/routes/import-history.ts:45
     2  server/routes/template-download-enhanced.ts:26
    11  server/services/analyticsService.ts:280
     5  server/services/memoryAnalyticsService.ts:91
(TraeAI-3) C:\Users\mhdtb\OneDrive\Desktop\trae+replitV1\TbzResumeBuilderV4 [1:2] $ 
(TraeAI-3) C:\Users\mhdtb\OneDrive\Desktop\trae+replitV1\TbzResumeBuilderV4 [1:2] $ 