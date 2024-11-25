import React, { useEffect,Fragment } from 'react'

export default function ZoomMeeting() {


    let payload = {
        meetingNumber: 3725450037,
        role: 0,
        sdkKey: 'r91wA5WYLQonbsaPwbqPjcSCqSLF2sisDJU3',
        sdkSecret: 'fSzsdlOQ5SlJiQhZbr0NNYKfaxTHI9PutlQK',
        password: 'uLk65t',
        userName: 'Testing',
        userEmail: 'acllasdev@gmail.com',
        leaveUrl: 'http://localhost:5173'
    };


    async function startMeeting(params) {

          const {ZoomMtg} = await import('@zoomus/websdk');

             ZoomMtg.setZoomJSLib('https://source.zoom.us/lib','/av')

             
            ZoomMtg.preLoadWasm();
            ZoomMtg.prepareWebSDK();

            ZoomMtg.generateSDKSignature({
            meetingNumber: payload.meetingNumber,
            role: payload.role,
            sdkKey: payload.sdkKey,
            sdkSecret: payload.sdkSecret,
            success: function(signature) {

                console.log(1)
                ZoomMtg.init({
                leaveUrl: payload.leaveUrl,
                success: function() {
                    ZoomMtg.join({
                    meetingNumber: payload.meetingNumber,
                    signature: signature.result,
                    userName: payload.userName,
                    userEmail: payload.userEmail,
                    password: payload.password,
                        success: function() {
                            console.log('joined')
                        },
                        error: function(error) {
                            console.log(error);
                            console.log(3)
                        }

                    });
                },
                error: function(error) {
                    console.log(error);
                    console.log(2)
                },
                });
            },
            error: function(error) {
                console.log(error);
                console.log(5)
            },
            });
        
    }


    useEffect(()=>{
        startMeeting()


    },[])
  
  return (
    <div className="w-full">
            <h1>Zoom</h1>
    </div>
  )
}
