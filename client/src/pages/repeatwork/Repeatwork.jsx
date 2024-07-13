import Sidebar from '../../components/sidebar/Sidebar';
import Stillworking from '../../components/stillworking/stillworking';
import './repeatwork.scss';


const Repeatwork = () => {
    return (
        <div>
            <div className='repeatwork'>
                <div className='repeatwork__left'>
                    <Sidebar />
                </div>
                <div className='repeatwork__right'>
                    <Stillworking />
                    <h5>Sorry! We still working on it!</h5>
                </div>
            </div>
        </div>
    );
};

export default Repeatwork;
