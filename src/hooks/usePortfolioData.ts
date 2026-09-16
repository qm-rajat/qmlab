import { useState, useEffect } from 'react';
import { SiteSettings, Project, Blog, Certificate } from '../types';

const EMPTY_SETTINGS: SiteSettings = {
  hero_name: "",
  hero_tagline: "",
  hero_bio: "",
  profile_image_url: "",
  about_text: "",
  seo_home_title: "",
  seo_home_description: "",
  seo_home_keywords: "",
  seo_og_image_url: "",
  skills: [],
  experience: [],
  education: [],
  social_links: {},
  resume_storage_path: "",
  logo_url: "",
  is_under_maintenance: false,
  google_maps_embed_url: "",
  contact_email: "",
  contact_location: "",
  company_name: "",
  company_tagline: "",
  hero_stats: [],
  overview_fourth_stat: { label: "", value: "" },
  overview_fifth_stat: { label: "", value: "" },
  overview_sixth_stat: { label: "", value: "" }
};

export function usePortfolioData() {
  // --- LOCAL PERSISTENT STORAGE SYNC ENGINE ---
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...EMPTY_SETTINGS, ...parsed };
      } catch (e) {
        return EMPTY_SETTINGS;
      }
    }
    return EMPTY_SETTINGS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_blogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  // Client Reactions State Tracking (Bookmarked and Liked Blogs)
  const [likedBlogs, setLikedBlogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_liked_blogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('qmlabs_portfolio_bookmarked_blogs');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Active Item State
  const [currentView, setCurrentView] = useState('home'); // home, projects, blog, certificates, contact, resume, admin
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Filters
  const [blogCatFilter, setBlogCatFilter] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkillCat, setSelectedSkillCat] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_blogs', JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_liked_blogs', JSON.stringify(likedBlogs));
  }, [likedBlogs]);

  useEffect(() => {
    localStorage.setItem('qmlabs_portfolio_bookmarked_blogs', JSON.stringify(bookmarkedBlogs));
  }, [bookmarkedBlogs]);

  // Load live content from the server on mount (if KV store configured)
  useEffect(() => {
    let isMounted = true;
    let retries = 0;
    const maxRetries = 3;

    const loadContent = () => {
      fetch('/api/content')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (!isMounted) return;
          if (!data.success || !data.storeConfigured) return;
          setSettings({ ...EMPTY_SETTINGS, ...data.settings });
          setProjects(data.projects || []);
          setBlogs(data.blogs || []);
          setCertificates(data.certificates || []);
        })
        .catch(err => {
          if (!isMounted) return;
          if (retries < maxRetries) {
            retries++;
            setTimeout(loadContent, 1200 * retries);
          } else {
            console.warn('Live content server not reachable, using cached copy:', err?.message || err);
          }
        });
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // Restore admin login state from the server session cookie after a page refresh.
  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsAdminLoggedIn(!!data.loggedIn))
      .catch(() => {});
  }, []);

  // Persist admin edits to server (plus optimistic local update)
  const persistUpdate = <T,>(setter: (v: T) => void, endpoint: string) => (value: T) => {
    setter(value);
    fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(value)
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Save failed (${res.status})`);
        }
      })
      .catch(err => {
        console.error(`Failed to save to ${endpoint}:`, err);
        window.alert(`Your change didn't save to the server: ${err.message}\n\nIt's only kept locally in this browser until you retry.`);
      });
  };

  const handleUpdateSettings = persistUpdate<SiteSettings>(setSettings, '/api/admin/settings');
  const handleUpdateProjects = persistUpdate<Project[]>(setProjects, '/api/admin/projects');
  const handleUpdateBlogs = persistUpdate<Blog[]>(setBlogs, '/api/admin/blogs');
  const handleUpdateCertificates = persistUpdate<Certificate[]>(setCertificates, '/api/admin/certificates');

  // Route Telemetry Tracking: record real page views
  useEffect(() => {
    const routePath = currentView === 'home' ? '/' : `/${currentView}`;
    fetch('/api/telemetry/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: routePath, referrer: document.referrer || '' })
    }).catch(() => {});
  }, [currentView]);

  // Liking Toggle with Real Server Sync
  const handleLikeToggle = (id: string) => {
    const isCurrentlyLiked = likedBlogs.includes(id);
    const newLikedList = isCurrentlyLiked
      ? likedBlogs.filter(bId => bId !== id)
      : [...likedBlogs, id];
    
    setLikedBlogs(newLikedList);
    setBlogs(blogs.map(b => b.id === id ? { ...b, like_count: Math.max(0, (b.like_count || 0) + (isCurrentlyLiked ? -1 : 1)) } : b));

    fetch(`/api/blogs/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment: !isCurrentlyLiked })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.like_count === 'number') {
          setBlogs(prev => prev.map(b => b.id === id ? { ...b, like_count: data.like_count } : b));
        }
      })
      .catch(() => {});
  };

  // Bookmarking Toggle
  const handleBookmarkToggle = (id: string) => {
    if (bookmarkedBlogs.includes(id)) {
      setBookmarkedBlogs(bookmarkedBlogs.filter(bId => bId !== id));
    } else {
      setBookmarkedBlogs([...bookmarkedBlogs, id]);
    }
  };

  // Trigger telemetry views on reading a blog post with real server recording
  const handleReadBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('blog_post');
    const newViewCount = (blog.view_count || 0) + 1;
    setBlogs(blogs.map(b => b.id === blog.id ? { ...b, view_count: newViewCount } : b));
    window.scrollTo({ top: 0, behavior: 'instant' });

    fetch(`/api/blogs/${blog.id}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.view_count === 'number') {
          setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, view_count: data.view_count } : b));
        }
      })
      .catch(() => {});

    fetch('/api/telemetry/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `/blog/${blog.slug || blog.id}` })
    }).catch(() => {});
  };

  const uniqueBlogCats = Array.from(new Set(blogs.flatMap(b => b.categories || [])));
  const filteredBlogs = blogs.filter(b => {
    const matchesCat = blogCatFilter ? b.categories?.includes(blogCatFilter) : true;
    const matchesSearch = b.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          b.excerpt?.toLowerCase().includes(blogSearch.toLowerCase());
    return matchesCat && matchesSearch && b.status === "published";
  });

  return {
    settings,
    setSettings,
    projects,
    setProjects,
    blogs,
    setBlogs,
    certificates,
    setCertificates,
    likedBlogs,
    bookmarkedBlogs,
    currentView,
    setCurrentView,
    selectedBlog,
    setSelectedBlog,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    blogCatFilter,
    setBlogCatFilter,
    blogSearch,
    setBlogSearch,
    skillSearch,
    setSkillSearch,
    selectedSkillCat,
    setSelectedSkillCat,
    uniqueBlogCats,
    filteredBlogs,
    handleUpdateSettings,
    handleUpdateProjects,
    handleUpdateBlogs,
    handleUpdateCertificates,
    handleLikeToggle,
    handleBookmarkToggle,
    handleReadBlog
  };
}
