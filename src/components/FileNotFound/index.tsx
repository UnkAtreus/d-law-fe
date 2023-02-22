import { Button } from 'antd';
import React from 'react';
import { RiDownloadFill } from 'react-icons/ri';

function FileNotFound() {
    return (
        <div className=" flex h-full w-full max-w-screen-sm items-center justify-center">
            <div className="flex w-full flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-lg">
                <div className="text-lg">FileName</div>
                <div className="text-base">
                    ไม่มีตัวอย่างที่จะสามารถแสดงไฟล์นี้ได้
                </div>
                <div>
                    <Button
                        type="primary"
                        icon={
                            <RiDownloadFill className="mr-2 inline-flex h-5 w-5 items-center justify-center" />
                        }
                    >
                        ดาวน์โหลด
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FileNotFound;
