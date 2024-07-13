import Sidebar from '../../components/sidebar/Sidebar';
import Stillworking from '../../components/stillworking/stillworking';
import './project.scss';


const Project = () => {
    return (
        <div>
            <div className='project'>
                <div className='project__left'>
                    <Sidebar />
                </div>
                <div className='project__right'>
                    <Stillworking />
                    <h5>Sorry! We still working on it!</h5>
                </div>
            </div>
        </div>
    );
};

export default Project;
