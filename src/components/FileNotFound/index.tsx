import { Button, Empty, Space } from 'antd';
import Link from 'next/link';
import React from 'react';
import { RiDownloadFill } from 'react-icons/ri';

function FileNotFound({ download, name }: { download: string; name: string }) {
    return (
        <div className=" flex h-full w-full max-w-screen-sm items-center justify-center">
            <div className="flex w-full flex-col items-center rounded-lg bg-white p-6 shadow-lg">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="text-base text-gray-600">
                                    {name}
                                </div>
                                <div className="text-gray-500">
                                    ไม่มีตัวอย่างที่จะสามารถแสดงไฟล์นี้ได้
                                </div>
                            </div>
                            <Space>
                                <Link href={download}>
                                    <Button
                                        type="primary"
                                        icon={
                                            <RiDownloadFill className="icon__button mr-2" />
                                        }
                                    >
                                        ดาวน์โหลด
                                    </Button>
                                </Link>
                            </Space>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

export default FileNotFound;
