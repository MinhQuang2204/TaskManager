import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { Typography, Box, Button, LinearProgress, Chip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import Sidebar from '../../components/sidebar/Sidebar';
import './Addnormalwork.scss';
import { addTask } from '../../redux/taskSlice';

const Addnormalwork = () => {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const { auth } = useSelector((state) => ({ ...state }));
    const { currentUser } = auth;
    const initialState = {
        task: '',
        start_plan: '',
        time_start_plan: '',
        end_plan: '',
        time_end_plan: '',
        description: '',
    };
    // Xử lý upload file
    const [fileUploads, setFileUploads] = useState([]);
    const [fileUploadProgress, setFileUploadProgress] = useState(0)

    // Xử lý thông tin khác của task
    const [state, setState] = useState(initialState);
    const [users, setUsers] = useState([]);
    const [selectedAssignOptions, setSelectedAssignOptions] = useState([]);
    const [selectedFollowerOptions, setSelectedFollowerOptions] = useState([]);

    // Lấy danh sách các user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/getusers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Cập nhật trạng thái của các ô input
    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
        // Kiểm tra ngày và giờ
        if (e.target.name === 'end_plan' || e.target.name === 'time_end_plan' || e.target.name === 'start_plan' || e.target.name === 'time_start_plan') {
            validateDates({ ...state, [e.target.name]: e.target.value });
        }
    };
    // Hàm kiểm tra ngày phù hợp hay không
    const validateDates = (data) => {
        const { start_plan, end_plan, time_start_plan, time_end_plan } = data;
        let newErrors = {};
        const currentDateTime = new Date();

        if (new Date(start_plan) > new Date(end_plan)) {
            newErrors.end_plan = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
        } else if (new Date(start_plan).toDateString() === new Date(end_plan).toDateString()) {
            if (time_start_plan && time_end_plan) {
                const startDateTime = new Date(`${start_plan}T${time_start_plan}`);
                const endDateTime = new Date(`${end_plan}T${time_end_plan}`);
                if (startDateTime <= currentDateTime) {
                    newErrors.time_start_plan = 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại';
                };
                if (startDateTime >= endDateTime) {
                    newErrors.time_end_plan = 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu';
                };
            }
        }
        setErrors(newErrors);
    };

    // Chọn file
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const totalSize = files.reduce((total, file) => total + file.size, 0) + fileUploads.reduce((total, file) => total + file.size, 0);

        if (totalSize > 524288000) { // 500MB
            toast.error('Tổng kích thước các file không được vượt quá 500MB');
            return;
        }

        setFileUploads(prevFiles => [...prevFiles, ...files]);
    };

    // Xoá file
    const handleRemoveFile = (file) => {
        setFileUploads(prevFiles => prevFiles.filter(f => f !== file));
    };

    // Tiến trình tải file
    const loadingOption = {
        onUploadProgress: (progressEvent) => {
            const { total, loaded } = progressEvent;
            const precentage = Math.floor(((loaded / 1000) * 100) / (total / 1000))
            setFileUploadProgress(precentage)
        }
    };

    // Chức năng button submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!state.task) {
            toast.error('Vui lòng nhập tên công việc!');
            return;
        }
        if (state.task.length < 10) {
            toast.error('Tên công việc phải dài ít nhất 10 kí tự');
            return;
        }
        if (selectedAssignOptions.length === 0 || selectedFollowerOptions.length === 0) {
            toast.error('Vui lòng chọn người thực hiện và người giám sát!');
            return;
        }
        // Kiểm tra ngày phù hợp
        validateDates(state);
        if (Object.keys(errors).length > 0) {
            toast.error('Vui lòng kiểm tra lại thời gian phù hợp trước khi tiếp tục!');
            return;
        }
        try {
            const newTaskId = await dispatch(addTask(
                state.task,
                currentUser.id,
                state.start_plan,
                state.time_start_plan,
                state.end_plan,
                state.time_end_plan,
                selectedAssignOptions.map(option => option.value),
                currentUser.username,
                selectedFollowerOptions.map(option => option.value),
                state.description,
            ));

            // Nếu có file cần upload
            if (fileUploads.length >= 0) {
                console.log("fileUploads: ", fileUploads);
                const formData = new FormData();
                fileUploads.forEach(file => formData.append('file', file));
                formData.append('idtask', newTaskId); // Sử dụng _id của task vừa được thêm vào
                console.log("ID TASK: ", newTaskId)
                console.log("Form DATA: ", formData)
                loadingOption;

                await axios.post('http://localhost:4000/api/multiupload', formData, loadingOption);
            }

            toast.success('Thêm công việc thành công!');
            setState(initialState);
            setSelectedAssignOptions([]);
            setSelectedFollowerOptions([]);
            setFileUploads([]);
            setTimeout(() => {
                setFileUploadProgress(0);
            }, 1500);

        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            toast.error(message);
        }
    };

    // Chức năng button reset
    const handleReset = () => {
        setState(initialState);
        setSelectedAssignOptions([]);
        setSelectedFollowerOptions([]);
        setFileUploads([]);
    };

    return (
        <div>
            <div className='addnormalwork'>
                <div className='addnormalwork__left'>
                    <Sidebar />
                </div>
                <div className='addnormalwork__right'>
                    <div className='bigform'>
                        <h5>Nhập thông tin công việc</h5>
                        <form action='' onSubmit={handleSubmit} onReset={handleReset}>
                            <div className="form-group">
                                <label htmlFor="title">Tên công việc <sup className="required-stick">&nbsp;*</sup></label>
                                <input
                                    type="text" id="task" name="task"
                                    placeholder="Nhập tên công việc"
                                    onChange={handleChange}
                                    value={state.task} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="start_plan">Bắt đầu</label>
                                <input
                                    type="date" id="start_plan" name="start_plan"
                                    onChange={handleChange}
                                    value={state.start_plan}
                                />
                                <input
                                    type="time" id="time_start_plan" name="time_start_plan"
                                    placeholder="hh:mm"
                                    onChange={handleChange}
                                    value={state.time_start_plan}
                                />
                                {errors.time_start_plan && <span className="error">{errors.time_start_plan}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="end_plan">Kết thúc</label>
                                <input
                                    type="date" id="end_plan" name="end_plan"
                                    onChange={handleChange}
                                    value={state.end_plan}
                                />
                                <input
                                    type="time" id="time_end_plan" name="time_end_plan"
                                    placeholder="hh:mm"
                                    onChange={handleChange}
                                    value={state.time_end_plan}
                                />
                                {errors.end_plan && <span className="error">{errors.end_plan}</span>}
                                {errors.time_end_plan && <span className="error">{errors.time_end_plan}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="assign_ids">Người thực hiện</label>
                                <Select
                                    isMulti
                                    options={users.map(user => ({ value: user.username, label: `${user.username}` }))}
                                    value={selectedAssignOptions}
                                    onChange={setSelectedAssignOptions}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="follower_ids">Người giao việc</label>
                                <input
                                    value={currentUser.username}
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="follower_ids">Người theo dõi</label>
                                <Select
                                    isMulti
                                    options={users.map(user => ({ value: user.username, label: `${user.username}` }))}
                                    value={selectedFollowerOptions}
                                    onChange={setSelectedFollowerOptions}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="title">Mô tả</label>
                                <textarea
                                    type="text" id="description" name="description"
                                    placeholder='Viết mô tả công việc'
                                    rows="2"
                                    onChange={handleChange}
                                    value={state.description}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="file">Tệp đính kèm</label>
                                <Button variant='contained' component='label' color='secondary' fullWidth >
                                    <CloudUploadIcon />
                                    &nbsp;
                                    Chọn tệp đính kèm
                                    <input hidden
                                        type='file' id='file' name='file'
                                        multiple
                                        onChange={handleFileSelect}
                                    />
                                </Button>
                                {fileUploads.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        {fileUploads.map((file, index) => (
                                            <Chip
                                                key={index}
                                                label={file.name}
                                                onDelete={() => handleRemoveFile(file)}
                                                sx={{ m: 0.5 }}
                                            />
                                        ))}
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ flexGrow: 1 }}><LinearProgress value={fileUploadProgress} variant='determinate' sx={{ width: '100%' }} /></Box>
                                    <Typography variant='body1'>{fileUploadProgress}%</Typography>
                                </Box>
                            </div>

                            <button type="submit">Thêm công việc</button>
                            <button type="reset">Huỷ bỏ</button>
                        </form>
                    </div>

                    <div className='background'>
                        <img src="/src/images/edit2.jpg" alt="background" />
                        <img src="/src/images/edit4.jpg" alt="background" />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Addnormalwork;
