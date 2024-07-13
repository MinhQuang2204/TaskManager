import Sidebar from '../../components/sidebar/Sidebar';
import './processwork.scss';
import Stillworking from '../../components/stillworking/stillworking';

const Processwork = () => {
    return (
        <div>
            <div className='processwork'>
                <div className='processwork__left'>
                    <Sidebar />
                </div>
                <div className='processwork__right'>
                    <Stillworking />
                    <h5>Sorry! We still working on it!</h5>
                </div>
            </div>
        </div>
    );
};

export default Processwork;
