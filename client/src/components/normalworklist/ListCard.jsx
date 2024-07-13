import { BiChevronLeft, BiChevronRight, BiTrash, BiEdit } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { arrowClick, deleteItem } from '../../redux/taskSlice';
import { addShownToast } from '../../redux/toastSlice'

import './listcard.scss';

const ListCard = ({ item }) => {
	const dispatch = useDispatch();
	// const shownToasts = useSelector(state => state.toast.shownToasts);

	// Hàm chuyển đổi giá trị trạng thái sang văn bản tiếng Việt
	const convertStatus = (status) => {
		switch (status) {
			case 'backlog':
				return 'Lưu trữ';
			case 'todo':
				return 'Chờ';
			case 'doing':
				return 'Đang thực hiện';
			case 'done':
				return 'Hoàn thành';
			default:
				return status;
		}
	};
	const formatDate = (date) => {
		return date ? moment(date).format('YYYY-MM-DD') : 'Chưa chọn ngày';
	};

	const ArrowClick = (string) => {
		if (item.category === 'createdby') {
			dispatch(arrowClick(item, string));
		} else {
			toast.warn('Bạn không có quyền thay đổi trạng thái công việc này');
		}
	};

	const handleDelete = () => {
		if (item.category === 'createdby') {
			dispatch(deleteItem(item._id));
		} else {
			toast.warn('Bạn không có quyền xóa công việc này');
		}
	};

	const handleEdit = () => {
		localStorage.setItem('currentTaskId', item._id);

		if (item.category == 'createdby')
			window.location.href = 'http://localhost:5173/normalwork/edit';
		else if (item.category == 'assigned')
			window.location.href = 'http://localhost:5173/assigned_normalwork/edit';
		else if (item.category == 'followed')
			window.location.href = 'http://localhost:5173/followed_normalwork/edit';

	};

	return (
		<div>
			<ul className={` ${item.status === 'done' ? 'completed menu' : 'menu'}`}>
				<li className='item'>
					<p>{item.task}</p>
				</li>
				<li className='item'>
					<p>{item.owner_id}</p>
				</li>
				<li className='item'>
					<p>{convertStatus(item.status)}</p>
				</li>
				<li className='item'>
					<p>{formatDate(item.start_plan)}</p>
				</li>
				<li className='item'>
					<p>{formatDate(item.end_plan)}</p>
				</li>
				<li className='item'>
					<p>{item.assign_ids.join('/ ')}</p>
				</li>
				<li className='button'>
					<button
						disabled={item.status === 'backlog'}
						onClick={() => ArrowClick('left')}
						className="btn"
					>
						<BiChevronLeft />
					</button>

					<button
						disabled={item.status === 'done'}
						onClick={() => ArrowClick('right')}
						className="btn"
					>
						<BiChevronRight />
					</button>

					<button onClick={handleDelete} className="btn">
						<BiTrash />
					</button>

					<button onClick={handleEdit} className="btn">
						<BiEdit />
					</button>
				</li>
			</ul>
			<ToastContainer />
		</div>
	);
};

export default ListCard;
