document.addEventListener("DOMContentLoaded", function () {
  const addProjectIcon = document.getElementById("add-project-icon");
  const projectDialog = document.getElementById("project-dialog");
  const addProjectButton = document.getElementById("addProjectButton");
  const cancelProjectButton = document.getElementById("cancelProjectButton");
  const projectForm = document.getElementById("projectForm");

  const editProjectDialog = document.getElementById("edit-project-dialog");
  const editProjectButton = document.getElementById("editProjectButton");
  const cancelEditProjectButton = document.getElementById("cancelEditProjectButton");
  const editProjectForm = document.getElementById("editProjectForm");

  const addBlogIcon = document.getElementById("add-blog-icon");
  const blogDialog = document.getElementById("blog-dialog");
  const addBlogButton = document.getElementById("addBlogButton");
  const cancelBlogButton = document.getElementById("cancelBlogButton");
  const blogForm = document.getElementById("blogForm");

  const editBlogDialog = document.getElementById("edit-blog-dialog");
  const editBlogButton = document.getElementById("editBlogButton");
  const cancelEditBlogButton = document.getElementById("cancelEditBlogButton");
  const editBlogForm = document.getElementById("editBlogForm");

  addProjectIcon.addEventListener("click", function () {
    projectDialog.classList.remove("hidden");
    document.body.classList.add("dialog-open");
  });

  cancelProjectButton.addEventListener("click", function () {
    projectDialog.classList.add("hidden");
    projectForm.reset();
    addProjectButton.disabled = true;
    document.body.classList.remove("dialog-open");
  });

  projectForm.addEventListener("input", function () {
    const isFormValid = projectForm.checkValidity();
    addProjectButton.disabled = !isFormValid;
  });

  projectForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const projectData = {
      title: projectForm.projectTitle.value,
      description: projectForm.projectDescription.value,
      image: projectForm.projectImage.value,
    };

    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          projectDialog.classList.add("hidden");
          projectForm.reset();
          addProjectButton.disabled = true;
          document.body.classList.remove("dialog-open");
          loadProjects();
        } else {
          console.error("Error adding project:", data.error);
        }
      })
      .catch((error) => console.error("Error adding project:", error));
  });

  cancelEditProjectButton.addEventListener("click", function () {
    editProjectDialog.classList.add("hidden");
    editProjectForm.reset();
    document.body.classList.remove("dialog-open");
  });

  editProjectForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const projectId = editProjectForm.editProjectId.value;
    const projectData = {
      title: editProjectForm.editProjectTitle.value,
      description: editProjectForm.editProjectDescription.value,
      image: editProjectForm.editProjectImage.value,
    };

    fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          editProjectDialog.classList.add("hidden");
          editProjectForm.reset();
          document.body.classList.remove("dialog-open");
          loadProjects();
        } else {
          console.error("Error updating project:", data.error);
        }
      })
      .catch((error) => console.error("Error updating project:", error));
  });

  addBlogIcon.addEventListener("click", function () {
    blogDialog.classList.remove("hidden");
    document.body.classList.add("dialog-open");
  });

  cancelBlogButton.addEventListener("click", function () {
    blogDialog.classList.add("hidden");
    blogForm.reset();
    addBlogButton.disabled = true;
    document.body.classList.remove("dialog-open");
  });

  blogForm.addEventListener("input", function () {
    const isFormValid = blogForm.checkValidity();
    addBlogButton.disabled = !isFormValid;
  });

  blogForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const blogData = {
      title: blogForm.blogTitle.value,
      description: blogForm.blogDescription.value,
      image: blogForm.blogImage.value,
    };

    fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          blogDialog.classList.add("hidden");
          blogForm.reset();
          addBlogButton.disabled = true;
          document.body.classList.remove("dialog-open");
          loadBlogPosts();
        } else {
          console.error("Error adding blog:", data.error);
        }
      })
      .catch((error) => console.error("Error adding blog:", error));
  });

  cancelEditBlogButton.addEventListener("click", function () {
    editBlogDialog.classList.add("hidden");
    editBlogForm.reset();
    document.body.classList.remove("dialog-open");
  });

  editBlogForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const blogId = editBlogForm.editBlogId.value;
    const blogData = {
      title: editBlogForm.editBlogTitle.value,
      description: editBlogForm.editBlogDescription.value,
      image: editBlogForm.editBlogImage.value,
    };

    fetch(`/api/blogs/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          editBlogDialog.classList.add("hidden");
          editBlogForm.reset();
          document.body.classList.remove("dialog-open");
          loadBlogPosts();
        } else {
          console.error("Error updating blog:", data.error);
        }
      })
      .catch((error) => console.error("Error updating blog:", error));
  });

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const loginData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          document.getElementById("login").classList.add("hidden");
          document.getElementById("mainContent").classList.remove("hidden");
          document.getElementById("navbar").classList.remove("hidden");
          loadProjects();
          loadBlogPosts();
        } else {
          throw new Error("Kullanıcı adı veya şifre yanlış!");
        }
      })
      .catch((error) => {
        console.error("Giriş yapılırken bir hata oluştu:", error.message);
        alert(error.message);
      });
  });

  document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("login").classList.remove("hidden");
    document.getElementById("mainContent").classList.add("hidden");
    document.getElementById("navbar").classList.add("hidden");
  });

  document.getElementById("mobile-menu").addEventListener("click", function () {
    document.querySelector(".nav-list").classList.toggle("active");
  });

  const navItems = document.querySelectorAll(".nav-list li a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      document.querySelector(".nav-list").classList.remove("active");
    });
  });

  function loadProjects() {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        const projectsGrid = document.getElementById("projects-grid");
        projectsGrid.innerHTML = "";
        data.projects.forEach((project) => {
          const projectDiv = document.createElement("div");
          projectDiv.className = "project";
          projectDiv.innerHTML = `
            <img src="${project.image}" alt="${project.title}" />
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="edit-buttons">
              <i class="fa-solid fa-pen-to-square" data-id="${project.id}" data-type="project"></i>
              <i class="fa-solid fa-trash" data-id="${project.id}" data-type="project"></i>
            </div>
          `;
          projectsGrid.appendChild(projectDiv);
        });

        document.querySelectorAll(".fa-pen-to-square[data-type='project']").forEach((editIcon) => {
          editIcon.addEventListener("click", function () {
            const projectId = this.getAttribute("data-id");
            fetch(`/api/projects/${projectId}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.project) {
                  editProjectForm.editProjectId.value = data.project.id;
                  editProjectForm.editProjectTitle.value = data.project.title;
                  editProjectForm.editProjectDescription.value = data.project.description;
                  editProjectForm.editProjectImage.value = data.project.image;
                  editProjectDialog.classList.remove("hidden");
                  document.body.classList.add("dialog-open");
                } else {
                  console.error("Project not found");
                }
              })
              .catch((error) => console.error("Error fetching project:", error));
          });
        });

        document.querySelectorAll(".fa-trash[data-type='project']").forEach((deleteIcon) => {
          deleteIcon.addEventListener("click", function () {
            const projectId = this.getAttribute("data-id");
            fetch(`/api/projects/${projectId}`, {
              method: "DELETE",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  loadProjects();
                } else {
                  console.error("Error deleting project:", data.error);
                }
              })
              .catch((error) => console.error("Error deleting project:", error));
          });
        });
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }

  function loadBlogPosts() {
    fetch("/api/blogs")
      .then((response) => response.json())
      .then((data) => {
        const blogGrid = document.getElementById("blog-grid");
        blogGrid.innerHTML = "";
        data.blogs.forEach((blog) => {
          const blogDiv = document.createElement("div");
          blogDiv.className = "blog-card";
          blogDiv.innerHTML = `
            <img src="${blog.image}" alt="${blog.title}" />
            <h3>${blog.title}</h3>
            <p>${blog.description}</p>
            <div class="edit-buttons">
              <i class="fa-solid fa-pen-to-square" data-id="${blog.id}" data-type="blog"></i>
              <i class="fa-solid fa-trash" data-id="${blog.id}" data-type="blog"></i>
            </div>
          `;
          blogGrid.appendChild(blogDiv);
        });

        document.querySelectorAll(".fa-pen-to-square[data-type='blog']").forEach((editIcon) => {
          editIcon.addEventListener("click", function () {
            const blogId = this.getAttribute("data-id");
            fetch(`/api/blogs/${blogId}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.blog) {
                  editBlogForm.editBlogId.value = data.blog.id;
                  editBlogForm.editBlogTitle.value = data.blog.title;
                  editBlogForm.editBlogDescription.value = data.blog.description;
                  editBlogForm.editBlogImage.value = data.blog.image;
                  editBlogDialog.classList.remove("hidden");
                  document.body.classList.add("dialog-open");
                } else {
                  console.error("Blog not found");
                }
              })
              .catch((error) => console.error("Error fetching blog:", error));
          });
        });

        document.querySelectorAll(".fa-trash[data-type='blog']").forEach((deleteIcon) => {
          deleteIcon.addEventListener("click", function () {
            const blogId = this.getAttribute("data-id");
            fetch(`/api/blogs/${blogId}`, {
              method: "DELETE",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  loadBlogPosts();
                } else {
                  console.error("Error deleting blog:", data.error);
                }
              })
              .catch((error) => console.error("Error deleting blog:", error));
          });
        });
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }

  // Contact form submit handler
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const contactData = {
      name: contactForm.name.value,
      email: contactForm.email.value,
      message: contactForm.message.value,
    };

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          contactForm.reset();
          console.log("Mesaj başarıyla gönderildi!");
        } else {
          console.error("Mesaj gönderirken bir hata oluştu:", data.error);
        }
      })
      .catch((error) => console.error("Mesaj gönderirken bir hata oluştu:", error));
  });
});
