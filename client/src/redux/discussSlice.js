import axios from 'axios';

export const addDiscussion = (taskId, userName, content) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:4000/api/adddiscuss', { taskId, userName, content });
        dispatch(discussionAddedSuccessfully(response.data));
        return Promise.resolve(response.data);
    } catch (error) {
        dispatch(discussionAddFailure());
        return Promise.reject(error);
    }
};

export const fetchDiscussionsByTask = (taskId) => async (dispatch) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/discussions/${taskId}`);
        dispatch(discussionsFetchedSuccessfully(response.data));
        return Promise.resolve(response.data);
    } catch (error) {
        dispatch(discussionsFetchFailure());
        return Promise.reject(error);
    }
};

export const deleteDiscussion = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:4000/api/deldiscuss/${id}`);
        dispatch(discussionDeletedSuccessfully(id));
        return Promise.resolve();
    } catch (error) {
        dispatch(discussionDeleteFailure());
        return Promise.reject(error);
    }
};
