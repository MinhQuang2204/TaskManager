const User = require('../../database/model/user.model');
const jwt = require('jsonwebtoken');
const validator = require('email-validator');

function isAdult(dateOfBirth) {
	// Chuyển đổi ngày sinh thành đối tượng Date
	const birthDate = new Date(dateOfBirth);

	// Lấy năm, tháng và ngày của ngày sinh
	const birthYear = birthDate.getFullYear();
	const birthMonth = birthDate.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
	const birthDay = birthDate.getDate();

	// Lấy năm, tháng và ngày của ngày hiện tại
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1;
	const currentDay = currentDate.getDate();

	// Tính tuổi
	let age = currentYear - birthYear;
	if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
		age--;
	}

	// Kiểm tra xem người đó đã đủ 18 tuổi chưa
	return age >= 18;
}

const signin = async (req, res) => {
	let { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		console.log(user, req.body);
		if (!user) {
			return res.status(400).json({ message: 'Email không tồn tại' });
		}

		user.comparePassword(password, (err, match) => {
			if (!match || err) {
				return res.status(400).json({ message: 'Mật khẩu không chính xác' });
			}
			let token = jwt.sign({ _id: user._id }, 'kljclsadflkdsjfklsdjfklsdjf', {
				expiresIn: '1h',
			});

			res.status(200).json({
				message: 'Đăng nhập thành công!',
				token,
				lastname: user.lastname,
				firstname: user.firstname,
				username: user.username,
				email: user.email,
				id: user._id,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			});
		});
	} catch (error) {
		return res.status(400).json({ message: 'Đăng nhập thất bại' });
	}
};

const register = async (req, res) => {
	console.log(req.body, 'req');
	const { firstname, lastname, username, email, phone, dob, password } = req.body;
	try {
		if (!firstname) return res.status(400).json({ message: 'Vui lòng nhập họ và tên!' });

		if (!lastname) return res.status(400).json({ message: 'Vui lòng nhập họ và tên!' });

		if (!username) return res.status(400).json({ message: 'Vui lòng nhập tên người dùng!' });

		if (!email) return res.status(400).json({ message: 'Vui lòng nhập Email!' });

		if (!dob) return res.status(400).json({ message: 'Vui lòng nhập ngày sinh!' });

		if (!phone) return res.status(400).json({ message: 'Vui lòng nhập số điện thoại!' });
		// valited day of birth
		if (!isAdult(dob))
			return res.status(400).json({ message: 'Ngày sinh không phù hợp' })
		// Valiated phone number
		if (phone.length < 7 || phone.length > 15) {
			return res.status(400).json({ message: 'Số điện thoại không tồn tại' });
		}
		// Exist phone number
		let phoneExist = await User.findOne({ phone });
		if (phoneExist) {
			return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
		}
		if (!validator.validate(email)) {
			return res.status(400).json({ message: 'Email không tồn tại' });
		}
		if (!password || password.length < 6) {
			return res.status(400).json({ message: 'Mật khẩu yêu cầu phải có ít nhất 6 kí tự' });
		}
		const userExist = await User.findOne({ email });
		if (userExist) {
			return res.status(400).json({ message: 'Email đã được sử dụng' });
		}
		const usernameExist = await User.findOne({ username });
		if (usernameExist) {
			return res.status(400).json({ message: 'Tên người dùng đã được sử dụng' });
		}
		const user = new User({
			firstname,
			lastname,
			username,
			email,
			phone,
			dob,
			password,
		});

		await user.save();
		return res.status(200).json({ message: 'Tạo tài khoản người dùng thành công!', user });
	} catch (error) {
		return res.status(500).json({ message: 'Tạo tài khoản thất bại' });
	}
};

module.exports = {
	signin,
	register,
};
