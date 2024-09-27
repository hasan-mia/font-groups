import React from 'react';
import { Form, Input, Select, Button, Typography, Col, Row } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useFonts } from '../hooks/useFonts';
import { useFontGroups } from '../hooks/useFontGroups';
import { IoCreate } from 'react-icons/io5';

const { Title } = Typography;

const FontGroup = () => {
    const { fontList } = useFonts();
    const { handleAddFontGroup } = useFontGroups();

    const [form] = Form.useForm();


    // Handle on create button
    const onFinish = async (values) => {
        const formattedData = {
        name: values.groupTitle,
        font_ids: values.fonts
            .filter(font => font && font.fontSelect)
            .map(font => font.fontSelect)
        };
       await handleAddFontGroup(formattedData)
    };



    return (
        <div className='flex justify-center'>
            <div className='py-2 px-4 w-full lg:w-8/12 border border-dotted border-gray-400 rounded-md'>
                <Title level={3}>Create Font Group</Title>
                <p>You have to select at least two fonts</p>
                
                <Form form={form} onFinish={onFinish} layout="vertical" className='pt-2'>
                    <Form.Item
                    name="groupTitle"
                    rules={[{ required: true, message: 'Please input the group title!' }]}
                    >
                    <Input placeholder="Group Title" className='p-2'/>
                    </Form.Item>

                    <Form.List name="fonts"
                        initialValue={[{}, {}]}
                        rules={[
                            {
                            validator: async (_, fonts) => {
                                if (!fonts || fonts.length < 2) {
                                return Promise.reject(new Error('At least two fonts must be selected'));
                                }
                            },
                            },
                        ]}
                        >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                        {fields.map((field, index) => (
                            <div key={field.key} className="flex items-center space-x-4 mb-2 w-full">
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'fontName']}
                                    rules={[{ required: true, message: 'Font name is required' }]}
                                >
                                    <Input 
                                        className="bg-gray-100 p-2 border rounded-md text-gray-900 min-w-52" 
                                        placeholder="Font Name" 
                                        disabled 
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'fontSelect']}
                                    rules={[{ required: true, message: 'Please select a font' }]}
                                >
                                    <Select 
                                        className="p-2 h-12 min-w-52 bg-white border rounded-md"
                                        placeholder="Select a Font"
                                        onChange={(value) => {
                                            const selectedFont = fontList?.find(font => font?.id === value);
                                            form.setFieldsValue({
                                                fonts: form.getFieldValue('fonts').map((font, idx) => 
                                                    idx === index ? { ...font, fontName: selectedFont?.name } : font
                                                )
                                            });
                                        }}
                                    >
                                        {fontList?.map(font => (
                                            <Select.Option key={font?.id} value={font?.id}>
                                                {font?.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                {index >= 2 && (
                                    <MinusCircleOutlined 
                                        className="cursor-pointer text-red-500 hover:text-red-700" 
                                        onClick={() => remove(field.name)} 
                                    />
                                )}
                            </div>
                        ))}
                        
                        <Form.ErrorList errors={errors} />
                        </>
                    )}

                    </Form.List>

                    <Row justify="space-between" align="middle">
                    <Col>
                        <Form.Item>
                        <Button 
                            type="dashed" 
                            className='p-2 text-lg'
                            onClick={() => form.setFieldsValue({ 
                            fonts: [...(form.getFieldValue('fonts') || []), {}] 
                            })} 
                            icon={<PlusOutlined />}
                        >
                            Add Row
                        </Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button type="dashed" icon={<IoCreate />} className='bg-green-900 text-white p-2 text-lg' htmlType="submit">
                                Create
                            </Button>
                        </Form.Item>
                    </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default FontGroup;