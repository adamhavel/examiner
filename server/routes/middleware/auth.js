'use strict';

exports.isAuthenticated = function(req, res, next) {
   if (!req.isAuthenticated()) {
      return res.send(401, 'User is not authorized');
   }
   next();
};

exports.isTeacher = function(req, res, next) {
   if (req.user.role !== 'teacher') {
      return res.send(403, 'Access forbidden');
   }
   next();
};