// 搜索功能
document.addEventListener('DOMContentLoaded', function() {
  // 初始化搜索索引
  const idx = lunr(function() {
    this.field('title');
    this.field('content');
    this.ref('id');
    
    // 將所有章節內容添加到索引中
    for (let i = 0; i < searchData.length; i++) {
      this.add({
        id: searchData[i].id,
        title: searchData[i].title,
        content: searchData[i].content
      });
    }
  });
  
  // 搜索功能
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value;
      
      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }
      
      const results = idx.search(query);
      
      if (results.length === 0) {
        searchResults.innerHTML = '<p>沒有找到相關結果</p>';
        return;
      }
      
      let resultsHtml = '<div class="list-group">';
      
      results.forEach(function(result) {
        const item = searchData.find(item => item.id === result.ref);
        resultsHtml += `
          <a href="${item.url}" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">${item.title}</h5>
            </div>
            <p class="mb-1">${item.excerpt}</p>
          </a>
        `;
      });
      
      resultsHtml += '</div>';
      searchResults.innerHTML = resultsHtml;
    });
  }
  
  // 目錄導航功能
  const tocLinks = document.querySelectorAll('.toc-link');
  
  if (tocLinks.length > 0) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      document.querySelectorAll('section[id]').forEach(function(section) {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          document.querySelector(`.toc-link[href="#${sectionId}"]`)?.classList.add('active');
        } else {
          document.querySelector(`.toc-link[href="#${sectionId}"]`)?.classList.remove('active');
        }
      });
    });
    
    tocLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // 返回頂部按鈕
  const backToTopButton = document.querySelector('.back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // 評論功能
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');
  
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nameInput = document.getElementById('comment-name');
      const contentInput = document.getElementById('comment-content');
      
      if (!nameInput.value || !contentInput.value) {
        alert('請填寫姓名和評論內容');
        return;
      }
      
      const now = new Date();
      const formattedDate = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
      
      const commentItem = document.createElement('li');
      commentItem.className = 'comment-item';
      commentItem.innerHTML = `
        <div class="d-flex justify-content-between">
          <span class="comment-author">${nameInput.value}</span>
          <span class="comment-date">${formattedDate}</span>
        </div>
        <div class="comment-content">${contentInput.value}</div>
      `;
      
      commentList.appendChild(commentItem);
      
      nameInput.value = '';
      contentInput.value = '';
      
      // 在實際應用中，這裡應該發送AJAX請求將評論保存到服務器
    });
  }
});

// 搜索數據
const searchData = [
  // 這裡將由各章節內容動態生成
];
