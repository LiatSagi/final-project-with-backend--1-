import React, { useContext } from 'react'
import { FileUploader } from 'react-drag-drop-files';
import { multiStepContextEdit } from './EditFundContext'

export default function StepTwo() {
    const { setCurrentStep, fundData, setFundData, submitData, fundImage, setFundImage, formErrorsStep2 } = useContext(multiStepContextEdit);
    const fileTypes = ["JPEG", "JPG", "PNG"];

    // Convert file into base64
    function getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    // Handle file change
    const handleChange = (file) => {
        setFundImage(file);
        getBase64(file, (result) => {
            setFundData({ ...fundData, "fundImage": result })
        })
         // Indicate that the image has been updated    
        fundData.imageIsUpdated = true;
    }
    return (
        <div>
            <div className="card-body">
                <form className="text-start">
                    {/* Image Attachment Section */}
                    <div className="form-group text-center pb-3">צירוף תמונה</div>
                    <div className='text-center'>
                        <div className='d-flex justify-content-center'>
                            <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
                        </div>
                        <p>{
                            fundImage ?
                                <img className='rounded img-fluid' src={fundData.fundImage} alt={fundImage.name} /> :
                                <img className='rounded img-fluid' src={fundData.fundImage} alt={fundData.title} />
                        }</p>
                    </div>
                    <div className="text-danger form-label mb-3">
                        {formErrorsStep2.fundImage}
                    </div>
                    {/* Contact Details Section */}
                    <div className="form-group text-center pb-3">פרטי יצירת קשר</div>
                    <label className="form-label">Email</label>
                    <div className="input-group input-group-outline mb-1">
                        <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={fundData['contactEmail']||''}
                            onChange={(e) => { setFundData({ ...fundData, "contactEmail": e.target.value }) }} />
                    </div>
                    <div className="text-danger form-label mb-3">
                        {formErrorsStep2.contactEmail}
                    </div>
                    <label className="form-label">מספר טלפון</label>
                    <div className="input-group input-group-outline mb-1">
                        <input
                            type="contact"
                            className="form-control"
                            placeholder=""
                            value={fundData['contactNumber']||''}
                            onChange={(e) => { setFundData({ ...fundData, "contactNumber": e.target.value }) }} />
                    </div>
                    <div className="text-danger form-label mb-3">
                        {formErrorsStep2.contactNumber}
                    </div>
                    {/* Navigation Buttons */}        
                    <div className="row d-flex justify-content-center">
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            <button type="button" onClick={() => setCurrentStep(1)} className="btn bg-gradient-secondary w-100 my-4 mb-2">הקודם</button>
                        </div>
                        <div className='col-lg-4 col-md-4 col-sm-4'>
                            <button type="button" onClick={submitData} className="btn bg-gradient-primary w-100 my-4 mb-2">שלח</button>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    )
}
