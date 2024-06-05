import fsPromises from 'fs/promises';
import path from 'path';

import ctrlWrapper from "../decorators/ctrlWrapper.js";
import usersServices from "../services/usersServices.js";
import gravatar from 'gravatar';
import HttpError from '../helpers/HttpError.js';
import Jimp from 'jimp';

const register = async (req, res) => {
	const { name, email, avatar, token } = await usersServices.register({
		...req.body,
		avatar: gravatar.url(req.body.email),
	});

	res.status(201).json({
		user: {
			name,
			email,
			avatar,
			token
		}
	});
};

const login = async (req, res) => {
	const user = await usersServices.login(req.body);
	const { name, email, avatar, token } = user;

	res.status(200).json({
		token,
		user: {
			name,
			email,
			avatar,
		}
	})
};

const updateAvatar = async (req, res) => {
	if (!req.file) {
		throw HttpError(400, 'No file attached');
	}
	const { _id } = req.user;
	const { path: tmpPath, filename } = req.file;
	const avatarsDir = path.resolve('public', 'avatars');
	await resizeAvatar(tmpPath);
	const avatarPath = path.join(avatarsDir, filename);
	await fsPromises.rename(tmpPath, avatarPath);
	const avatarURL = path.join('avatars', filename);
	await usersServices.update(_id, { avatar: avatarURL });

	res.status(200).json({
		avatar: avatarURL,
	})
}

const resizeAvatar = async (avatarPath) => {
	const avatar = await Jimp.read(avatarPath);
	await avatar.resize(250, 250).writeAsync(avatarPath);
}

const getCurrentUser = (req,res) => {
  const {name, email, followers, following, avatar} = req.user;
  console.log(req);

  res.json({
    name,
    email,
    followers,
    following,
    avatar
  })
}

const logout = async (req, res) => {
  const { _id } = req.user;

  await usersServices.update(_id, { token: null });
  res.status(204).send();
};

export default {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	updateAvatar: ctrlWrapper(updateAvatar),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
}
