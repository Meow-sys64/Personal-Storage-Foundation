
const { body, validationResult } = require('express-validator')
const passport = require('passport');
const multer = require('multer')
const upload = multer({ dest: './temp_file_storage/' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const path = require('path');
const fs = require('fs');

module.exports = {

  async index(req, res, next) {
    // Collect all user's folders to send to frontend
    const userFolders = await prisma.folder.findMany({
      where: {
        userId: req.user?.id
      }
    })
    //const userLooseFiles = await prisma.file.findMany({
    //  include: {
    //    folder: true
    //  },
    //  where: {
    //    userId: req.user.id
    //  }
    //})
    console.log(userFolders)
    //console.log(userLooseFiles)
    res.render("index", { username: req.user?.username, userFolders })
  },

  logout(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    })
  },

  upload: [
    upload.single('uploaded_file'),
    async (req, res, next) => {
      const finishedFile = await prisma.file.create({
        include: {
          folder: true,
        },
        data: {
          name: (req.body.file_name || req.file.originalname),
          url: req.file.path,
          user: { connect: { id: req.user.id } },
          folder: {
            connectOrCreate: {
              where: { name: req.body.folder_name },
              create: {
                name: req.body.folder_name,
                user: { connect: { id: req.user.id } }
              }
            }
          }
        }
      })
      console.log(finishedFile)
      res.redirect('/')
    }],

  async getFolder(req, res, next) {
    try {
      const loadedFolder = await prisma.folder.findUnique({
        where: {
          id: parseInt(req.params.folderId)
        }
      })

      console.log(req.session)
      console.log(req.user)
      console.log(req.user?.username)
      if (!loadedFolder) {
        //Folder not found
        //return res.render("errorPage", {
        //  errorMessage: "Folder not found.",
        //  username: req.user?.username
        //})
        next(new Error("Folder Not Found"))
      }

      if (loadedFolder?.userId !== req.user.id) {
        //Unauthorized
        return res.status(401).render("errorPage", {
          errorMessage: "Unauthorized",
          username: req.user?.username
        })
      }

      const loadedFiles = await prisma.file.findMany({
        where: {
          folderId: parseInt(req.params.folderId),
        }
      })

      //if (loadedFiles.userId !== req.user.id) {
      //  return res.status(401).render("errorPage", {
      //    errorMessage: "Unauthorized",
      //    username:req.user?.username
      //  })
      //}
      //TODO: Render files on an access basis

      console.log(loadedFiles)

      res.render("fileList", { loadedFiles, username: req.user?.username })
    }
    catch (err) {
      console.log(err)
      return next(new Error())
    }



  },
  async getFile(req, res, next) {
    try {
      const loadedFile = await prisma.file.findUnique({
        where: {
          id: parseInt(req.params.fileId)
        }
      })

      if (!loadedFile) {
        next(new Error("File Not Found"))
      }

      if (loadedFile.userId !== req.user.id) {
        return res.status(401).render("errorPage", {
          errorMessage: "Unauthorized",
          username: req.user?.username
        })
      }

      res.render("filePage", { loadedFile, username: req.user?.username })

    }
    catch (err) {
      console.error(err)
      return next(new Error())
    }
  },
  async downloadFile(req, res, next) {
    try {
      const { fileUrl } = req.params;
      const userAuth = await prisma.file.findUnique({
        where: { url: `temp_file_storage/${fileUrl}` }
      })
      if(!userAuth){
      next(new Error(`File not found in database`))
      }

      if (req.user?.id !== userAuth?.userId) {
        next(new Error(`User doesn't have access to this file`))
      }
      const parentDir = path.join(__dirname, '..');
      const filePath = path.join(parentDir, 'temp_file_storage', fileUrl);

      // Check if file exists
      if (fs.existsSync(filePath)) {
        // Set the correct Content-Disposition header for file download
        res.download(filePath, (err) => {
          if (err) {
            next(new Error('Error Downloading the File'))
          }
        });
      } else {
        next(new Error("File not found."))
      }

    }
    catch (err) {
      console.error(err)
      next(new Error())
    }
  }
}
