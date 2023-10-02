import React, { useState } from 'react';
import Modal from 'react-modal';
import image from '../images/image.png';

Modal.setAppElement('#root'); // Set your root element ID here

const ScreenRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [mediaStream, setMediaStream] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    const startRecording = async () => {
    setIsModalOpen(false);

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setMediaStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setMediaStream(null);
        setRecording(false);
        uploadVideo(blob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing screen:', error);
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const uploadVideo = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('video', blob);
  
      const response = await fetch('https://video-woiq.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        if (result && result.videoUrl) {
        //   navigate(`/playrecord?videoUrl=${encodeURIComponent(result.videoUrl)}`);
          console.log(result); // Log the result for debugging
        //   return result.videoUrl;
        } else {
          console.error('Invalid response format from the server');
          // Handle the unexpected response format
        }
      } else {
        console.error('Failed to upload video. Server returned:', response.status, response.statusText);
        // Handle different HTTP error statuses
        // You might want to check for specific status codes (e.g., 500) and handle them accordingly
      }
    } catch (error) {
      console.error('Error uploading video:', error.message);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };
  


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='start-recording'>
        { !recording && <div className="extension-modal">
            <div className="extension-modal-header">
                <div className="extension-modal-header-intro">
                    <div className="extension-modal-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <g clipPath="url(#clip0_502_2163)">
                                <path d="M21.7983 11.7894C21.4065 10.4385 20.6937 9.20245 19.7207 8.18669C18.7477 7.17092 17.5434 6.40563 16.2106 5.95612C14.8938 5.57283 13.5097 5.47865 12.1532 5.68001C10.7966 5.88138 9.49958 6.37354 8.35091 7.12278C8.25639 7.2175 8.13787 7.28469 8.00805 7.31714C7.87824 7.3496 7.74204 7.34609 7.61407 7.30699C7.35607 7.22341 7.12362 7.07549 6.93863 6.87717C6.80397 6.63419 6.76042 6.35114 6.81582 6.07892C6.85101 5.94826 6.9128 5.82628 6.99733 5.72062C7.08186 5.61495 7.1873 5.52789 7.30705 5.46489C10.5614 3.56138 13.7544 3.07015 16.8246 4.05261C18.3361 4.55536 19.7161 5.38974 20.8635 6.49466C22.0109 7.59959 22.8968 8.9471 23.4562 10.4386H27.5702C26.729 7.12031 24.7011 4.22526 21.8701 2.30077C19.039 0.376283 15.601 -0.444251 12.206 -0.00569532C8.81093 0.43286 5.69423 2.10011 3.44514 4.68083C1.19605 7.26155 -0.0295595 10.5769 3.54369e-05 14C3.54369e-05 14.5526 0.0614389 15.0438 0.0614389 15.5965H5.28074C5.48007 15.5852 5.67768 15.6389 5.8438 15.7497C6.00992 15.8604 6.13556 16.0222 6.20179 16.2105C6.60284 17.5568 7.31887 18.7881 8.29059 19.8025C9.2623 20.817 10.4617 21.5853 11.7895 22.0438C13.1063 22.4271 14.4903 22.5213 15.8469 22.3199C17.2035 22.1186 18.5005 21.6264 19.6492 20.8772C19.7437 20.7825 19.8622 20.7153 19.992 20.6828C20.1218 20.6504 20.258 20.6539 20.386 20.693C20.644 20.7765 20.8765 20.9245 21.0614 21.1228C21.1961 21.3658 21.2397 21.6488 21.1842 21.921C21.1491 22.0517 21.0873 22.1737 21.0027 22.2793C20.9182 22.385 20.8128 22.4721 20.693 22.5351C18.8421 23.7805 16.6608 24.4434 14.4299 24.4386C13.3272 24.4303 12.2314 24.2649 11.1755 23.9473C9.65762 23.4566 8.27154 22.6264 7.12247 21.5199C5.9734 20.4134 5.09156 19.0596 4.5439 17.5614H0.491263C1.37895 20.8251 3.41814 23.6571 6.23189 25.5339C9.04565 27.4107 12.4437 28.2054 15.798 27.7712C19.1523 27.3369 22.2359 25.703 24.4789 23.1715C26.722 20.64 27.9727 17.3821 28 14C28.0115 13.4875 27.991 12.9748 27.9386 12.4649H22.7807C22.5714 12.4511 22.3696 12.381 22.1967 12.2621C22.0238 12.1433 21.8862 11.98 21.7983 11.7894Z" fill="#100A42"/>
                                <path d="M14.0594 20.1247C15.2682 20.1131 16.4466 19.744 17.4461 19.064C18.4455 18.3839 19.2214 17.4233 19.676 16.3031C20.1305 15.183 20.2435 13.9533 20.0005 12.7691C19.7576 11.5849 19.1696 10.499 18.3107 9.6483C17.4518 8.79759 16.3604 8.22006 15.1739 7.98846C13.9874 7.75686 12.7589 7.88154 11.6432 8.34681C10.5274 8.81208 9.57424 9.59712 8.90379 10.6031C8.23333 11.609 7.87554 12.7908 7.87549 13.9997C7.87545 14.809 8.03581 15.6104 8.3473 16.3573C8.65878 17.1043 9.11522 17.7822 9.69023 18.3517C10.2652 18.9212 10.9474 19.3712 11.6974 19.6755C12.4473 19.9798 13.2501 20.1325 14.0594 20.1247Z" fill="white"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_502_2163">
                                <rect width="28" height="28" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                        <span>HelpMeOut</span>
                    </div>
                    <div className="settings">
                        <div className="settings-icon">
                            <div className="extension-modal-svg-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#120B48" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M1.6665 10.7334V9.2667C1.6665 8.40003 2.37484 7.68336 3.24984 7.68336C4.75817 7.68336 5.37484 6.6167 4.6165 5.30836C4.18317 4.55836 4.4415 3.58336 5.19984 3.15003L6.6415 2.32503C7.29984 1.93336 8.14984 2.1667 8.5415 2.82503L8.63317 2.98336C9.38317 4.2917 10.6165 4.2917 11.3748 2.98336L11.4665 2.82503C11.8582 2.1667 12.7082 1.93336 13.3665 2.32503L14.8082 3.15003C15.5665 3.58336 15.8248 4.55836 15.3915 5.30836C14.6332 6.6167 15.2498 7.68336 16.7582 7.68336C17.6248 7.68336 18.3415 8.3917 18.3415 9.2667V10.7334C18.3415 11.6 17.6332 12.3167 16.7582 12.3167C15.2498 12.3167 14.6332 13.3834 15.3915 14.6917C15.8248 15.45 15.5665 16.4167 14.8082 16.85L13.3665 17.675C12.7082 18.0667 11.8582 17.8334 11.4665 17.175L11.3748 17.0167C10.6248 15.7084 9.3915 15.7084 8.63317 17.0167L8.5415 17.175C8.14984 17.8334 7.29984 18.0667 6.6415 17.675L5.19984 16.85C4.4415 16.4167 4.18317 15.4417 4.6165 14.6917C5.37484 13.3834 4.75817 12.3167 3.24984 12.3167C2.37484 12.3167 1.6665 11.6 1.6665 10.7334Z" stroke="#120B48" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <div className="close-circle">
                            <div className="svg-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M9.99984 18.3334C14.5832 18.3334 18.3332 14.5834 18.3332 10.0001C18.3332 5.41675 14.5832 1.66675 9.99984 1.66675C5.4165 1.66675 1.6665 5.41675 1.6665 10.0001C1.6665 14.5834 5.4165 18.3334 9.99984 18.3334Z" stroke="#B6B3C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7.6416 12.3583L12.3583 7.6416" stroke="#B6B3C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12.3583 12.3583L7.6416 7.6416" stroke="#B6B3C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-text">
                    <p>This extension helps you record and share help videos with ease.</p>
                </div>
            </div>
            <div className="extension-modal-body">
                <div className="extension-modal-body-content">
                    <div className="screen-size">
                        <div className="full-screen">
                            <div className="screen-size-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M8.5865 2.66675H23.3998C28.1465 2.66675 29.3332 3.85341 29.3332 8.58675V17.0267C29.3332 21.7734 28.1465 22.9467 23.4132 22.9467H8.5865C3.85317 22.9601 2.6665 21.7734 2.6665 17.0401V8.58675C2.6665 3.85341 3.85317 2.66675 8.5865 2.66675Z" stroke="#928FAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 22.96V29.3333" stroke="#928FAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2.6665 17.3333H29.3332" stroke="#928FAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 29.3333H22" stroke="#928FAB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p>Full screen</p>
                        </div>
                        <div className="copy-tab">
                            <div className="screen-size-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M21.3332 17.2001V22.8001C21.3332 27.4667 19.4665 29.3334 14.7998 29.3334H9.19984C4.53317 29.3334 2.6665 27.4667 2.6665 22.8001V17.2001C2.6665 12.5334 4.53317 10.6667 9.19984 10.6667H14.7998C19.4665 10.6667 21.3332 12.5334 21.3332 17.2001Z" stroke="#120B48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M29.3332 9.20008V14.8001C29.3332 19.4667 27.4665 21.3334 22.7998 21.3334H21.3332V17.2001C21.3332 12.5334 19.4665 10.6667 14.7998 10.6667H10.6665V9.20008C10.6665 4.53341 12.5332 2.66675 17.1998 2.66675H22.7998C27.4665 2.66675 29.3332 4.53341 29.3332 9.20008Z" stroke="#120B48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p>Current Tab</p>
                        </div>
                    </div>
                    <div className="selection-tab">
                        <div className="selection-tab-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M15.75 10.5L20.4697 5.78033C20.9421 5.30786 21.75 5.64248 21.75 6.31066V17.6893C21.75 18.3575 20.9421 18.6921 20.4697 18.2197L15.75 13.5M4.5 18.75H13.5C14.7426 18.75 15.75 17.7426 15.75 16.5V7.5C15.75 6.25736 14.7426 5.25 13.5 5.25H4.5C3.25736 5.25 2.25 6.25736 2.25 7.5V16.5C2.25 17.7426 3.25736 18.75 4.5 18.75Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className='selection-tab-text'>
                                <span>Camera</span>
                            </div>
                        </div>
                        <div className="toggle-base">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <g filter="url(#filter0_dd_358_4063)">
                                        <circle cx="11" cy="10" r="8" fill="white"/>
                                    </g>
                                    <defs>
                                        <filter id="filter0_dd_358_4063" x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="1"/>
                                        <feGaussianBlur stdDeviation="1"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_358_4063"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="1"/>
                                        <feGaussianBlur stdDeviation="1.5"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"/>
                                        <feBlend mode="normal" in2="effect1_dropShadow_358_4063" result="effect2_dropShadow_358_4063"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_358_4063" result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="selection-tab">
                        <div className="selection-tab-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className='selection-tab-text'>
                                <span>Audio</span>
                            </div>
                        </div>
                        <div className="toggle-base">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <g filter="url(#filter0_dd_358_4063)">
                                        <circle cx="11" cy="10" r="8" fill="white"/>
                                    </g>
                                    <defs>
                                        <filter id="filter0_dd_358_4063" x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="1"/>
                                        <feGaussianBlur stdDeviation="1"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0"/>
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_358_4063"/>
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                        <feOffset dy="1"/>
                                        <feGaussianBlur stdDeviation="1.5"/>
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0"/>
                                        <feBlend mode="normal" in2="effect1_dropShadow_358_4063" result="effect2_dropShadow_358_4063"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_358_4063" result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div onClick={openModal} disabled={recording} className="extension-modal-body-button">
                    <span>Start Recording</span>
                </div>
            </div>
        </div>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Recording Information"
        style={{ content: { border: 'none'}}}
      >
        <div className="modal">
            <div className="modal-header">
                <span>HelpMeOut wants to</span>
                <div onClick={closeModal} className="modal-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path d="M9.99984 19.2903C14.5832 19.2903 18.3332 15.5403 18.3332 10.957C18.3332 6.37366 14.5832 2.62366 9.99984 2.62366C5.4165 2.62366 1.6665 6.37366 1.6665 10.957C1.6665 15.5403 5.4165 19.2903 9.99984 19.2903Z" stroke="#B6B3C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.6416 13.3154L12.3583 8.59875" stroke="#B6B3C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.3583 13.3154L7.6416 8.59875" stroke="#B6B3C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
            <div className="frame-34">
                <div className="frame-34-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12.53 20.4201H6.21C3.05 20.4201 2 18.3201 2 16.2101V7.79008C2 4.63008 3.05 3.58008 6.21 3.58008H12.53C15.69 3.58008 16.74 4.63008 16.74 7.79008V16.2101C16.74 19.3701 15.68 20.4201 12.53 20.4201Z" stroke="#878787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.5202 17.0999L16.7402 15.1499V8.83989L19.5202 6.88989C20.8802 5.93989 22.0002 6.51989 22.0002 8.18989V15.8099C22.0002 17.4799 20.8802 18.0599 19.5202 17.0999Z" stroke="#878787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.5 11C12.3284 11 13 10.3284 13 9.5C13 8.67157 12.3284 8 11.5 8C10.6716 8 10 8.67157 10 9.5C10 10.3284 10.6716 11 11.5 11Z" stroke="#878787" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <span>Use your camera</span>
            </div>
            <div className="frame-34">
                <div className="frame-34-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 16.25C9.38 16.25 7.25 14.12 7.25 11.5V6C7.25 3.38 9.38 1.25 12 1.25C14.62 1.25 16.75 3.38 16.75 6V11.5C16.75 14.12 14.62 16.25 12 16.25ZM12 2.75C10.21 2.75 8.75 4.21 8.75 6V11.5C8.75 13.29 10.21 14.75 12 14.75C13.79 14.75 15.25 13.29 15.25 11.5V6C15.25 4.21 13.79 2.75 12 2.75Z" fill="#878787"/>
                        <path d="M12.0001 19.7499C7.3701 19.7499 3.6001 15.9799 3.6001 11.3499V9.6499C3.6001 9.2399 3.9401 8.8999 4.3501 8.8999C4.7601 8.8999 5.1001 9.2399 5.1001 9.6499V11.3499C5.1001 15.1499 8.2001 18.2499 12.0001 18.2499C15.8001 18.2499 18.9001 15.1499 18.9001 11.3499V9.6499C18.9001 9.2399 19.2401 8.8999 19.6501 8.8999C20.0601 8.8999 20.4001 9.2399 20.4001 9.6499V11.3499C20.4001 15.9799 16.6301 19.7499 12.0001 19.7499Z" fill="#878787"/>
                        <path d="M13.3899 7.18007C13.3099 7.18007 13.2199 7.17007 13.1299 7.14007C12.3999 6.87007 11.5999 6.87007 10.8699 7.14007C10.4799 7.28007 10.0499 7.08007 9.90988 6.69007C9.76988 6.30007 9.96988 5.87007 10.3599 5.73007C11.4199 5.35007 12.5899 5.35007 13.6499 5.73007C14.0399 5.87007 14.2399 6.30007 14.0999 6.69007C13.9799 6.99007 13.6899 7.18007 13.3899 7.18007Z" fill="#878787"/>
                        <path d="M12.8001 9.30007C12.7301 9.30007 12.6701 9.29007 12.6001 9.27007C12.2001 9.16007 11.7901 9.16007 11.3901 9.27007C10.9901 9.38007 10.5801 9.14007 10.4701 8.74007C10.3601 8.35007 10.6001 7.94007 11.0001 7.83007C11.6501 7.65007 12.3501 7.65007 13.0001 7.83007C13.4001 7.94007 13.6401 8.35007 13.5301 8.75007C13.4401 9.08007 13.1301 9.30007 12.8001 9.30007Z" fill="#878787"/>
                        <path d="M12 22.75C11.59 22.75 11.25 22.41 11.25 22V19C11.25 18.59 11.59 18.25 12 18.25C12.41 18.25 12.75 18.59 12.75 19V22C12.75 22.41 12.41 22.75 12 22.75Z" fill="#878787"/>
                    </svg>
                </div>
                <span>Use your microphone</span>
            </div>
            <div className="modal-buttons">
                <button onClick={startRecording} className="allow-button">Allow</button>
                <button onClick={closeModal} className="deny-button">Deny</button>
            </div>
        </div>
      </Modal>
        
      {  recording &&
      <div className="buttom-floater">
        <div className="avater">
            <img src={image} alt="avater" />
        </div>
        <div className="record-board">
            <div className="record-container">
                <div className="menus">
                    <div className="timer">
                        <div className="counter">
                            <span>00:03:45 </span>
                            <div className="frame"></div>
                        </div>
                        <div className="line"></div>
                    </div>
                    <div className="controls-section">
                        <div className="stop" onClick={stopRecording} disabled={!recording}>
                            <div className="controls-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M5.25 7.5C5.25 6.25736 6.25736 5.25 7.5 5.25H16.5C17.7426 5.25 18.75 6.25736 18.75 7.5V16.5C18.75 17.7426 17.7426 18.75 16.5 18.75H7.5C6.25736 18.75 5.25 17.7426 5.25 16.5V7.5Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span>stop</span>
                        </div>
                        <div className="camera">
                            <div className="controls-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15.75 10.5L20.4697 5.78033C20.9421 5.30786 21.75 5.64248 21.75 6.31066V17.6893C21.75 18.3575 20.9421 18.6921 20.4697 18.2197L15.75 13.5M4.5 18.75H13.5C14.7426 18.75 15.75 17.7426 15.75 16.5V7.5C15.75 6.25736 14.7426 5.25 13.5 5.25H4.5C3.25736 5.25 2.25 6.25736 2.25 7.5V16.5C2.25 17.7426 3.25736 18.75 4.5 18.75Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span>camera</span>
                        </div>
                        <div className="mic">
                            <div className="controls-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span>mic</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      }

      {/* {recordedVideo && (
        <PlayRecord videoRef={videoRef} recordedVideo={recordedVideo}/>
      )} */}
    </div>
  );
};

export default ScreenRecorder;
