const MeditationCenter = require('../models/meditationCenter');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const meditationCenters = await MeditationCenter.find({}).populate('popupText');
    res.render('meditationCenters/index', { meditationCenters })
}

module.exports.renderNewForm = (req, res) => {
    res.render('meditationCenters/new');
}

module.exports.createMeditationCenter = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.meditationCenter.location,
        limit: 1
    }).send()
    const meditationCenter = new MeditationCenter(req.body.meditationCenter);
    meditationCenter.geometry = geoData.body.features[0].geometry;
    meditationCenter.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    meditationCenter.author = req.user._id;
    await meditationCenter.save();
    req.flash('success', 'Successfully made a new meditationCenter!');
    res.redirect(`/meditationCenters/${meditationCenter._id}`)
}

module.exports.showMeditationCenter = async (req, res,) => {
    const meditationCenter = await MeditationCenter.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!meditationCenter) {
        req.flash('error', 'Cannot find that meditationCenter!');
        return res.redirect('/meditationCenters');
    }
    res.render('meditationCenters/show', { meditationCenter });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const meditationCenter = await MeditationCenter.findById(id)
    if (!meditationCenter) {
        req.flash('error', 'Cannot find that meditationCenter!');
        return res.redirect('/meditationCenters');
    }
    res.render('meditationCenters/edit', { meditationCenter });
}

module.exports.updateMeditationCenter = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const meditationCenter = await MeditationCenter.findByIdAndUpdate(id, { ...req.body.meditationCenter });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    meditationCenter.images.push(...imgs);
    await meditationCenter.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await meditationCenter.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated meditationCenter!');
    res.redirect(`/meditationCenters/${meditationCenter._id}`)
}

module.exports.deleteMeditationCenter = async (req, res) => {
    const { id } = req.params;
    await MeditationCenter.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted meditationCenter')
    res.redirect('/meditationCenters');
}