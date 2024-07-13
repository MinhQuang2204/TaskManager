import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment';

import { Typography, Box, Button, LinearProgress, Chip, TextField, Paper, Avatar } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import Sidebar from '../../components/sidebar/Sidebar';
import './assignededitnormalwork.scss';
import { getTaskById, editTask } from '../../redux/taskSlice';

const Editnormalwork = () => {
    const dispatch = useDispatch();
    const task = useSelector((state) => state.task.currentTask);
    const { auth } = useSelector((state) => ({ ...state }));
    const { currentUser } = auth;
    const error = useSelector((state) => state.task.error);
    const currentTaskId = localStorage.getItem('currentTaskId');
    const [state, setState] = useState({
        task: '',
        start_plan: '',
        time_start_plan: '',
        end_plan: '',
        time_end_plan: '',
        description: '',
    });

    // Xử lý thông tin của task
    const [users, setUsers] = useState([]);
    const [selectedAssignOptions, setSelectedAssignOptions] = useState([]);
    const [selectedFollowerOptions, setSelectedFollowerOptions] = useState([]);
    const taskStatuses = ['backlog', 'todo', 'doing', 'done'];
    // Ánh xạ giá trị trạng thái với nhãn tương ứng
    const statusLabels = {
        backlog: 'Lưu trữ',
        todo: 'Chờ',
        doing: 'Đang thực hiện',
        done: 'Hoàn thành'
    };
    const options = taskStatuses.map((status) => ({
        value: status,
        label: statusLabels[status] // Sử dụng nhãn tương ứng
    }));

    // Xử lý upload file
    const [fileUploads, setFileUploads] = useState([]);
    const [fileUploadProgress, setFileUploadProgress] = useState(0);

    // Xử lý thảo luận
    const [discussions, setDiscussions] = useState([]);
    const [newDiscussionContent, setNewDiscussionContent] = useState('');

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

    // Lấy dữ liệu thông tin công việc
    useEffect(() => {
        if (currentTaskId) {
            dispatch(getTaskById(currentTaskId))
                .catch((error) => {
                    console.error("Có lỗi xảy ra khi lấy dữ liệu công việc!", error);
                    toast.error("Có lỗi xảy ra khi lấy dữ liệu công việc!");
                });
        }

    }, [currentTaskId, dispatch]);
    // Hiển thị dữ liệu công việc lên form
    useEffect(() => {
        if (task) {
            setState({
                task: task.task,
                start_plan: task.start_plan ? moment(task.start_plan).format('YYYY-MM-DD') : '',
                time_start_plan: task.time_start_plan ? moment(task.time_start_plan, 'HH:mm:ss').format('HH:mm') : '',
                end_plan: task.end_plan ? moment(task.end_plan).format('YYYY-MM-DD') : '',
                time_end_plan: task.time_end_plan ? moment(task.time_end_plan, 'HH:mm:ss').format('HH:mm') : '',
                assign_ids: task.assign_ids || [],
                owner_id: task.owner_id,
                follower_ids: task.follower_ids || [],
                status: task.status,
                description: task.description,
            });
            setSelectedAssignOptions(task.assign_ids.map(id => ({ value: id, label: id })));
            setSelectedFollowerOptions(task.follower_ids.map(id => ({ value: id, label: id })));
        }
    }, [task]);
    // Hàm lấy thông tin file đính kèm theo task nếu có
    const fetchFiles = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/multiupload/${currentTaskId}`);
            console.log("Response data uploads:", response.data.data.files);
            const filesArray = response.data.data.files.map(file => ({
                name: file.fileName,
                path: file.filePath,
                type: file.fileType,
                size: file.fileSize
            }));
            setFileUploads(filesArray);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };
    // Hàm lấy thông tin file đính kèm theo task hiên tại
    useEffect(() => {
        if (currentTaskId) {
            fetchFiles();
        }
    }, [currentTaskId]);
    // Lấy danh sách thảo luận
    const fetchDiscussions = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/discussions/${currentTaskId}`);
            setDiscussions(response.data);
        } catch (error) {
            console.error('Error fetching discussions:', error);
            toast.error('Lỗi khi lấy danh sách thảo luận');
        }
    };
    // Lấy danh sách thảo luận theo task
    useEffect(() => {
        if (currentTaskId) {
            fetchDiscussions();
        }
    }, [currentTaskId]);

    // Cập nhật trạng thái của các ô input
    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };
    // Thay đổi trang thái công việc
    const handleSelectChange = (selectedOption) => {
        handleChange({ target: { name: 'status', value: selectedOption.value } });
    };

    // Chọn file
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setFileUploads(prevFiles => [...prevFiles, ...files]);
    };
    // Tiến trình tải file
    const loadingOption = {
        onUploadProgress: (progressEvent) => {
            const { total, loaded } = progressEvent;
            const precentage = Math.floor(((loaded / 1000) * 100) / (total / 1000))
            setFileUploadProgress(precentage)
        }
    };
    // Xoá file
    const handleRemoveFile = (fileToRemove) => {
        setFileUploads(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    // Hàm không cho phép cập nhật trạng thái công việc
    const handleNotAllow = () => {
        toast.warn('Bạn không có quyền cập nhật!')
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
        try {
            await dispatch(editTask(
                currentTaskId,
                state.task,
                state.start_plan,
                state.time_start_plan,
                state.end_plan,
                state.time_end_plan,
                selectedAssignOptions.map(option => option.value),
                state.owner_id,
                selectedFollowerOptions.map(option => option.value),
                state.status,
                state.description,
            ));
            // Nếu có file cần upload
            if (fileUploads.length >= 0) {
                //  console.log("fileUploads: ", fileUploads);
                const formData = new FormData();
                formData.append('idtask', currentTaskId);
                fileUploads.forEach(item => {
                    if (typeof item === 'object' && !(item instanceof File)) {
                        formData.append(`object`, JSON.stringify(item));
                    } else if (item instanceof File) {
                        formData.append(`file`, item);
                    }
                });
                loadingOption;
                await axios.put(`http://localhost:4000/api/multiupload/edit/${currentTaskId}`, formData, loadingOption);
            }
            toast.success('Cập nhật thông tin công việc thành công!');
            setTimeout(() => {
                // Gọi lại getTaskById để lấy thông tin công việc mới nhất
                dispatch(getTaskById(currentTaskId));
                // Sau khi upload file xong, load lại danh sách file
                fetchFiles();
                setFileUploadProgress(0);
            }, 1500);

        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            toast.error(message);
        }
    };
    // Chức năng nút quay lại
    const handleReturn = (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:5173/normalwork';
    };
    // Chức năng tải file đính kèm
    const handleDoubleClickFile = (file) => {
        // Handle double click to download file
        window.open(`http://localhost:4000/uploads/${file.name}`, '_blank');
    };
    // Chức năng tải toàn bộ file đính kèm
    const handleDownloadAll = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/download/all/${currentTaskId}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `all_files_${currentTaskId}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading all files:', error);
            toast.error('Lỗi khi tải toàn bộ file');
        }
    };
    // Chức năng thêm thảo luận mới
    const handleAddDiscussion = async (e) => {
        e.preventDefault();
        if (!newDiscussionContent.trim()) {
            toast.error('Nội dung thảo luận không được để trống');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:4000/api/adddiscuss`, {
                taskId: currentTaskId,
                userName: currentUser.username,
                content: newDiscussionContent
            });
            setDiscussions([...discussions, response.data]);
            setNewDiscussionContent('');
            toast.success('Thêm thảo luận thành công');
        } catch (error) {
            console.error('Error adding discussion:', error);
            toast.error('Lỗi khi thêm thảo luận');
        }
    };

    return (
        <div>
            <div className='editnormalwork'>
                <div className='editnormalwork__left'>
                    <Sidebar />
                </div>
                <div className='editnormalwork__right'>
                    <div className='bigform'>
                        <h5>Chỉnh sửa thông tin công việc</h5>
                        <form onSubmit={handleSubmit}  >
                            <div className="form-group">
                                <label htmlFor="title">Tên công việc <sup className="required-stick">&nbsp;*</sup></label>
                                <input
                                    type="text" id="task" name="task"
                                    placeholder="Nhập tên công việc" required
                                    readOnly
                                    onClick={handleNotAllow}
                                    value={state.task} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="start_plan">Bắt đầu</label>
                                <input
                                    type="date" id="start_plan" name="start_plan"
                                    value={state.start_plan}
                                    readOnly
                                    onClick={handleNotAllow}
                                />
                                <input
                                    type="time" id="time_start_plan" name="time_start_plan"
                                    placeholder="hh:mm"
                                    value={state.time_start_plan}
                                    readOnly
                                    onClick={handleNotAllow}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="end_plan">Kết thúc</label>
                                <input
                                    type="date" id="end_plan" name="end_plan"
                                    value={state.end_plan}
                                    readOnly
                                    onClick={handleNotAllow}
                                />
                                <input
                                    type="time" id="time_end_plan" name="time_end_plan"
                                    placeholder="hh:mm"
                                    value={state.time_end_plan}
                                    readOnly
                                    onClick={handleNotAllow}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="assign_ids">Người thực hiện</label>
                                <Select
                                    isMulti
                                    options={users.map(user => ({ value: user.username, label: `${user.username}` }))}
                                    value={selectedAssignOptions}
                                    onChange={handleNotAllow}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="owner_id">Người giao việc</label>
                                <input
                                    type="text" id="owner_id" name="owner_id"
                                    value={state.owner_id}
                                    readOnly
                                    onClick={handleNotAllow}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="follower_ids">Người theo dõi</label>
                                <Select
                                    isMulti
                                    options={users.map(user => ({ value: user.username, label: `${user.username}` }))}
                                    value={selectedFollowerOptions}
                                    onChange={handleNotAllow}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">Trạng thái công việc</label>
                                <Select
                                    id="status"
                                    name="status"
                                    options={options}
                                    value={options.find(option => option.value === state.status)}
                                    onChange={handleNotAllow}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="title">Mô tả</label>
                                <textarea
                                    type="text" id="description" name="description"
                                    placeholder='Viết mô tả công việc'
                                    rows="2"
                                    onClick={handleNotAllow}
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
                                                onDoubleClick={() => handleDoubleClickFile(file)}
                                                sx={{ m: 0.5, cursor: 'pointer' }}
                                            />
                                        ))}
                                        <Button variant='contained' color='primary' onClick={handleDownloadAll} sx={{ mt: 1 }}>
                                            Download All Files
                                        </Button>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ flexGrow: 1 }}><LinearProgress value={fileUploadProgress} variant='determinate' sx={{ width: '100%' }} /></Box>
                                    <Typography variant='body1'>{fileUploadProgress}%</Typography>
                                </Box>
                            </div>
                            <button type="submit">Cập nhật</button>
                            <button type="button" className='returnbutton' onClick={handleReturn}>Quay về</button>
                        </form>

                    </div>
                    <div className='background'>
                        <div className="discuss-group">
                            <Box mt={0}>
                                <Typography variant="h6" gutterBottom>
                                    Thảo luận:
                                </Typography>
                                <Box mb={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                    {discussions.map((discussion, index) => (
                                        <Paper key={index} elevation={2} style={{ padding: '16px', marginBottom: '16px' }}>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <Avatar alt={discussion.userName} src={`/path/to/avatar/${discussion.userName}.png`} />
                                                <Box ml={2}>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {moment(discussion.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        <strong>{discussion.userName}:</strong> {discussion.content}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>
                                <TextField
                                    id="newDiscussionContent"
                                    name="newDiscussionContent"
                                    label="Thêm thảo luận mới"
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    fullWidth
                                    value={newDiscussionContent}
                                    onChange={(e) => setNewDiscussionContent(e.target.value)}
                                    style={{ marginBottom: '16px' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddDiscussion}
                                    style={{ display: 'block', margin: '0 auto' }}
                                >
                                    Thêm thảo luận
                                </Button>
                            </Box>
                        </div>
                        {/* <img src="/src/images/edit.jpg" alt="background" /> */}
                        <img src="/src/images/edit3.jpg" alt="background" />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Editnormalwork;
