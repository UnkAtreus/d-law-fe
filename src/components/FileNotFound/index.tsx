import { Button, Empty, Space } from 'antd';
import React from 'react';
import { RiDownloadFill } from 'react-icons/ri';

function FileNotFound() {
    return (
        <div className=" flex h-full w-full max-w-screen-sm items-center justify-center">
            <div className="flex w-full flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-base text-gray-600">
                                    FileName
                                </div>
                                <div className="text-gray-500">
                                    ไม่มีตัวอย่างที่จะสามารถแสดงไฟล์นี้ได้
                                </div>
                            </div>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={
                                        <RiDownloadFill className="icon__button mr-2" />
                                    }
                                >
                                    ดาวน์โหลด
                                </Button>
                            </Space>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

export default FileNotFound;
