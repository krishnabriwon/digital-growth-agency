import { useState, useMemo } from "react";
import { crmStore } from "@/lib/crm/crm-store";
import type {
  CmsArticle,
  CmsFaq,
  CmsAnnouncement,
  CmsHeroSettings,
  CmsProcessStep,
} from "@/lib/crm/types";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  Megaphone,
  HelpCircle,
  Sparkles,
  LayoutTemplate,
  Route,
  ArrowRight,
  Clock,
  Tag,
  Check,
  AlertCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CmsTab() {
  const [activeSubTab, setActiveSubTab] = useState<"articles" | "faqs" | "announcement" | "hero" | "process">("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  // Notification state
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  // --- Article Editor State ---
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState<{
    title: string;
    slug: string;
    category: string;
    readTime: string;
    description: string;
    published: boolean;
    featured: boolean;
    sections: { heading: string; bodyText: string }[];
  }>({
    title: "",
    slug: "",
    category: "Search Marketing",
    readTime: "5 min read",
    description: "",
    published: true,
    featured: false,
    sections: [{ heading: "Introduction", bodyText: "" }],
  });

  // --- FAQ Editor State ---
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState<{
    q: string;
    a: string;
    category: "General" | "Services" | "Pricing" | "Process" | "Guarantees";
    order: number;
    published: boolean;
  }>({
    q: "",
    a: "",
    category: "General",
    order: 1,
    published: true,
  });

  // --- Announcement State ---
  const [announcementState, setAnnouncementState] = useState<CmsAnnouncement>(crmStore.getAnnouncement());

  // --- Hero State ---
  const [heroState, setHeroState] = useState<CmsHeroSettings>(crmStore.getHeroSettings());

  // --- Process State ---
  const [processList, setProcessList] = useState<CmsProcessStep[]>(crmStore.getProcessSteps());

  // Subscribe to live data
  const articles = crmStore.getArticles();
  const faqs = crmStore.getFaqs();

  // Categories list for articles
  const articleCategories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category));
    return ["All", ...Array.from(set)];
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCat = selectedCategory === "All" || art.category === selectedCategory;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && art.published) ||
        (statusFilter === "Draft" && !art.published);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        art.title.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [articles, selectedCategory, statusFilter, searchQuery]);

  // Handle slug auto-generation from title
  const handleTitleChange = (newTitle: string) => {
    const slug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setArticleForm((prev) => ({
      ...prev,
      title: newTitle,
      slug: editingArticleId ? prev.slug : slug,
    }));
  };

  // Open modal for new article
  const handleOpenNewArticle = () => {
    setEditingArticleId(null);
    setArticleForm({
      title: "",
      slug: "",
      category: "Search Marketing",
      readTime: "5 min read",
      description: "",
      published: true,
      featured: false,
      sections: [{ heading: "Key Takeaways", bodyText: "" }],
    });
    setIsArticleModalOpen(true);
  };

  // Open modal for editing article
  const handleOpenEditArticle = (art: CmsArticle) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      slug: art.slug,
      category: art.category,
      readTime: art.readTime,
      description: art.description,
      published: art.published,
      featured: !!art.featured,
      sections: art.sections.map((s) => ({
        heading: s.heading,
        bodyText: s.body.join("\n\n"),
      })),
    });
    setIsArticleModalOpen(true);
  };

  // Save article
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim() || !articleForm.slug.trim()) return;

    const formattedSections = articleForm.sections
      .filter((s) => s.heading.trim().length > 0 || s.bodyText.trim().length > 0)
      .map((s) => ({
        heading: s.heading.trim(),
        body: s.bodyText
          .split("\n\n")
          .map((p) => p.trim())
          .filter((p) => p.length > 0),
      }));

    if (editingArticleId) {
      crmStore.updateArticle(editingArticleId, {
        title: articleForm.title.trim(),
        slug: articleForm.slug.trim(),
        category: articleForm.category.trim(),
        readTime: articleForm.readTime.trim(),
        description: articleForm.description.trim(),
        published: articleForm.published,
        featured: articleForm.featured,
        sections: formattedSections,
      });
      showFeedback(`Article "${articleForm.title}" updated successfully!`);
    } else {
      crmStore.addArticle({
        title: articleForm.title.trim(),
        slug: articleForm.slug.trim(),
        category: articleForm.category.trim(),
        readTime: articleForm.readTime.trim(),
        description: articleForm.description.trim(),
        published: articleForm.published,
        featured: articleForm.featured,
        sections: formattedSections,
      });
      showFeedback(`New article "${articleForm.title}" created and published!`);
    }
    setIsArticleModalOpen(false);
  };

  // Section builders for article form
  const handleAddSection = () => {
    setArticleForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: "New Section", bodyText: "" }],
    }));
  };

  const handleRemoveSection = (idx: number) => {
    if (articleForm.sections.length <= 1) return;
    setArticleForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx),
    }));
  };

  const handleSectionHeadingChange = (idx: number, heading: string) => {
    setArticleForm((prev) => {
      const copy = [...prev.sections];
      copy[idx] = { ...copy[idx], heading };
      return { ...prev, sections: copy };
    });
  };

  const handleSectionBodyChange = (idx: number, bodyText: string) => {
    setArticleForm((prev) => {
      const copy = [...prev.sections];
      copy[idx] = { ...copy[idx], bodyText };
      return { ...prev, sections: copy };
    });
  };

  // Open modal for new FAQ
  const handleOpenNewFaq = () => {
    setEditingFaqId(null);
    setFaqForm({
      q: "",
      a: "",
      category: "General",
      order: faqs.length + 1,
      published: true,
    });
    setIsFaqModalOpen(true);
  };

  // Open modal for edit FAQ
  const handleOpenEditFaq = (f: CmsFaq) => {
    setEditingFaqId(f.id);
    setFaqForm({
      q: f.q,
      a: f.a,
      category: f.category,
      order: f.order,
      published: f.published,
    });
    setIsFaqModalOpen(true);
  };

  // Save FAQ
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.q.trim() || !faqForm.a.trim()) return;

    if (editingFaqId) {
      crmStore.updateFaq(editingFaqId, {
        q: faqForm.q.trim(),
        a: faqForm.a.trim(),
        category: faqForm.category,
        order: Number(faqForm.order) || 1,
        published: faqForm.published,
      });
      showFeedback("FAQ updated successfully!");
    } else {
      crmStore.addFaq({
        q: faqForm.q.trim(),
        a: faqForm.a.trim(),
        category: faqForm.category,
        order: Number(faqForm.order) || faqs.length + 1,
        published: faqForm.published,
      });
      showFeedback("New FAQ added to website!");
    }
    setIsFaqModalOpen(false);
  };

  // Save Announcement
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    crmStore.updateAnnouncement(announcementState);
    showFeedback("Top Announcement Bar settings updated!");
  };

  // Save Hero Settings
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    crmStore.updateHeroSettings(heroState);
    showFeedback("Website Hero & Tagline settings saved!");
  };

  // Save Process Step
  const handleUpdateProcessStep = (id: string, title: string, text: string) => {
    crmStore.updateProcessStep(id, { title, text });
    setProcessList(crmStore.getProcessSteps());
    showFeedback("Process step updated!");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#092B55]">Website CMS & Content Hub</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
              Live Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage your agency website's content in real-time. Publish blog articles, update FAQs, customize top announcement banners, and refine marketing headlines without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-600" /> View Live Blog
          </a>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#087BEA] text-white hover:bg-[#087BEA]/90 shadow-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View Public Site
          </a>
        </div>
      </div>

      {/* Floating feedback alert */}
      {savedFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedFeedback}</span>
          </div>
          <button onClick={() => setSavedFeedback(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("articles")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === "articles"
              ? "bg-[#092B55] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Articles & Resources</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold ml-1">
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("faqs")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === "faqs"
              ? "bg-[#092B55] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Website FAQs</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold ml-1">
            {faqs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("announcement")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === "announcement"
              ? "bg-[#092B55] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Top Announcement Bar</span>
          {announcementState.enabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("hero")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === "hero"
              ? "bg-[#092B55] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Hero & Headlines</span>
        </button>

        <button
          onClick={() => setActiveSubTab("process")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === "process"
              ? "bg-[#092B55] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white"
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>6-Step Process Roadmap</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. ARTICLES & RESOURCES CMS TAB                                 */}
      {/* ============================================================== */}
      {activeSubTab === "articles" && (
        <div className="space-y-4">
          {/* Controls & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search articles by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium"
              >
                {articleCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 font-medium"
              >
                <option value="All">Status: All</option>
                <option value="Published">Status: Published</option>
                <option value="Draft">Status: Draft</option>
              </select>
            </div>

            <Button
              onClick={handleOpenNewArticle}
              className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Write New Article
            </Button>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  art.published
                    ? "border-slate-200/80 shadow-xs hover:shadow-md"
                    : "border-dashed border-amber-200 bg-amber-50/20"
                }`}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#087BEA] border border-blue-100 uppercase tracking-wide">
                      {art.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {art.readTime}
                      </span>
                      <button
                        onClick={() => crmStore.toggleArticlePublish(art.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                          art.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {art.published ? "Published" : "Draft"}
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-[#092B55] leading-snug line-clamp-2 mb-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {art.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>{art.sections?.length || 0} Sections</span>
                    <span className="font-mono text-[11px]">/{art.slug}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </a>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEditArticle(art)}
                        className="h-7 px-2 text-xs text-slate-600 hover:text-[#087BEA]"
                      >
                        <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${art.title}"?`)) {
                            crmStore.deleteArticle(art.id);
                            showFeedback("Article deleted.");
                          }
                        }}
                        className="h-7 px-2 text-xs text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">No articles matched your search.</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting filters or write a new article.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. FAQS CMS TAB                                                */}
      {/* ============================================================== */}
      {activeSubTab === "faqs" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#092B55]">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">
                These questions display on the public Homepage and Services pages.
              </p>
            </div>
            <Button
              onClick={handleOpenNewFaq}
              className="h-9 text-xs bg-[#087BEA] hover:bg-[#087BEA]/90 text-white shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add New FAQ
            </Button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#087BEA] uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        faq.published !== false
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {faq.published !== false ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#092B55]">{faq.q}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEditFaq(faq)}
                    className="h-8 px-2.5 text-xs text-slate-600 hover:text-[#087BEA]"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this FAQ question?")) {
                        crmStore.deleteFaq(faq.id);
                        showFeedback("FAQ deleted.");
                      }
                    }}
                    className="h-8 px-2 text-xs text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ANNOUNCEMENT BAR CMS TAB                                     */}
      {/* ============================================================== */}
      {activeSubTab === "announcement" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#092B55]">Top Announcement Bar</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Display high-priority notices, festival offers, or free audit promotions across every page of your website.
              </p>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div>
                  <span className="font-bold text-slate-800 block text-xs">Display Announcement Bar</span>
                  <span className="text-[11px] text-slate-500">Show or hide notice at the very top of the site</span>
                </div>
                <input
                  type="checkbox"
                  checked={announcementState.enabled}
                  onChange={(e) =>
                    setAnnouncementState({ ...announcementState, enabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-[#087BEA] focus:ring-[#087BEA] cursor-pointer"
                />
              </div>

              {/* Badge Text */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Badge Label (optional)</Label>
                <Input
                  value={announcementState.badgeText}
                  onChange={(e) =>
                    setAnnouncementState({ ...announcementState, badgeText: e.target.value })
                  }
                  placeholder="e.g. 2026 GROWTH, LIMITED OFFER, NEW"
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Announcement Message *</Label>
                <Textarea
                  required
                  rows={2}
                  value={announcementState.message}
                  onChange={(e) =>
                    setAnnouncementState({ ...announcementState, message: e.target.value })
                  }
                  placeholder="e.g. Book a complimentary 30-minute growth roadmap session with our lead strategists."
                  className="text-xs bg-slate-50 border-slate-200 rounded-xl resize-none"
                />
              </div>

              {/* Link CTA Text & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Link Text</Label>
                  <Input
                    value={announcementState.linkText}
                    onChange={(e) =>
                      setAnnouncementState({ ...announcementState, linkText: e.target.value })
                    }
                    placeholder="e.g. Claim Free Audit"
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Link URL</Label>
                  <Input
                    value={announcementState.linkUrl}
                    onChange={(e) =>
                      setAnnouncementState({ ...announcementState, linkUrl: e.target.value })
                    }
                    placeholder="e.g. /contact or https://..."
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="h-9 text-xs bg-[#087BEA] text-white hover:bg-[#087BEA]/90">
                  Save Announcement Settings
                </Button>
              </div>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Interactive Preview
              </h3>

              <div className="rounded-xl border border-slate-300 overflow-hidden shadow-xs bg-slate-100">
                {/* Browser bar preview */}
                <div className="h-6 bg-slate-200 px-3 flex items-center gap-1.5 border-b border-slate-300">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[9px] text-slate-500 font-mono ml-2">digital-growth-agency-nine.vercel.app</span>
                </div>

                {/* Announcement rendered */}
                {announcementState.enabled ? (
                  <div className="bg-[#092B55] text-white py-2 px-3 text-xs flex items-center justify-center gap-2 border-b border-white/10">
                    {announcementState.badgeText && (
                      <span className="bg-[#087BEA] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                        {announcementState.badgeText}
                      </span>
                    )}
                    <span className="truncate text-slate-200 text-[11px]">{announcementState.message}</span>
                    {announcementState.linkText && (
                      <span className="font-bold text-[#39A9FF] underline text-[11px] shrink-0">
                        {announcementState.linkText} →
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 py-3 text-center text-slate-400 text-xs italic">
                    (Announcement bar is currently disabled)
                  </div>
                )}

                {/* Dummy Navbar preview */}
                <div className="h-12 bg-white px-4 flex items-center justify-between border-b border-slate-200">
                  <span className="font-bold text-sm text-[#092B55]">DMA</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                    <span>About</span>
                    <span>Services</span>
                    <span>Process</span>
                    <span>Resources</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#087BEA] text-white">
                    Free Consultation
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
              When enabled, this bar renders above the header across all pages. Visitors clicking the link are routed directly to your configured page or contact form.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. HERO & HEADLINES CMS TAB                                    */}
      {/* ============================================================== */}
      {activeSubTab === "hero" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#092B55]">Website Hero Section</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the main banner text that visitors see immediately upon landing on your homepage.
              </p>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Eyebrow Tagline</Label>
                <Input
                  value={heroState.eyebrow}
                  onChange={(e) => setHeroState({ ...heroState, eyebrow: e.target.value })}
                  placeholder="e.g. Digital marketing across Pan India"
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Primary Headline</Label>
                <Input
                  value={heroState.title}
                  onChange={(e) => setHeroState({ ...heroState, title: e.target.value })}
                  placeholder="e.g. Driving Digital Growth."
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Highlighted / Gradient Accent Text</Label>
                <Input
                  value={heroState.highlightText}
                  onChange={(e) => setHeroState({ ...heroState, highlightText: e.target.value })}
                  placeholder="e.g. Delivering Real Results."
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl text-sky-700 font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Subtitle / Description</Label>
                <Textarea
                  rows={3}
                  value={heroState.subtitle}
                  onChange={(e) => setHeroState({ ...heroState, subtitle: e.target.value })}
                  className="text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Primary CTA Button</Label>
                  <Input
                    value={heroState.primaryCtaText}
                    onChange={(e) => setHeroState({ ...heroState, primaryCtaText: e.target.value })}
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Secondary CTA Button</Label>
                  <Input
                    value={heroState.secondaryCtaText}
                    onChange={(e) => setHeroState({ ...heroState, secondaryCtaText: e.target.value })}
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <Button type="submit" className="h-9 text-xs bg-[#087BEA] text-white hover:bg-[#087BEA]/90">
                Save Hero Settings
              </Button>
            </form>
          </div>

          {/* Hero Preview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Hero Preview
              </h3>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-blue-50/40 border border-sky-100 shadow-xs space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#087BEA]">
                  {heroState.eyebrow}
                </p>
                <h1 className="text-2xl font-extrabold text-[#092B55] leading-tight">
                  {heroState.title}{" "}
                  <span className="text-[#087BEA] block sm:inline">{heroState.highlightText}</span>
                </h1>
                <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                  {heroState.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="px-3 py-2 rounded-lg bg-[#087BEA] text-white text-xs font-bold shadow-xs">
                    {heroState.primaryCtaText} →
                  </span>
                  <span className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold">
                    {heroState.secondaryCtaText}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
              Updates made here instantly configure the visual branding and headline messaging for visitors landing on the homepage.
            </p>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PROCESS ROADMAP CMS TAB                                     */}
      {/* ============================================================== */}
      {activeSubTab === "process" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#092B55]">6-Step Agency Process Roadmap</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the agency's client delivery methodology shown on the homepage and "Our Process" page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processList.map((step) => (
              <div key={step.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-[#087BEA] text-white font-mono text-xs font-bold flex items-center justify-center">
                    {step.stepNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Phase {step.stepNumber}</span>
                </div>

                <Input
                  value={step.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setProcessList((prev) =>
                      prev.map((s) => (s.id === step.id ? { ...s, title: newTitle } : s))
                    );
                  }}
                  onBlur={() => handleUpdateProcessStep(step.id, step.title, step.text)}
                  className="h-8 text-xs font-bold bg-white border-slate-200"
                />

                <Textarea
                  rows={3}
                  value={step.text}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setProcessList((prev) =>
                      prev.map((s) => (s.id === step.id ? { ...s, text: newText } : s))
                    );
                  }}
                  onBlur={() => handleUpdateProcessStep(step.id, step.title, step.text)}
                  className="text-xs bg-white border-slate-200 resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ARTICLE EDITOR MODAL                                           */}
      {/* ============================================================== */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-[#092B55]">
                  {editingArticleId ? "Edit Article" : "Write & Publish New Article"}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in article details, categories, and content sections.
                </p>
              </div>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Title & Slug */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Article Title *</Label>
                <Input
                  required
                  placeholder="e.g. 5 High-ROI Lead Generation Strategies for Indian Businesses"
                  value={articleForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">URL Slug *</Label>
                  <Input
                    required
                    placeholder="e.g. 5-lead-gen-strategies"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Category *</Label>
                  <Input
                    required
                    placeholder="e.g. Search Marketing, Paid Ads"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Estimated Read Time</Label>
                  <Input
                    placeholder="e.g. 6 min read"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Summary / Description */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Meta Summary / Excerpt *</Label>
                <Textarea
                  required
                  rows={2}
                  placeholder="A concise 2-sentence summary that displays in search engines and blog cards..."
                  value={articleForm.description}
                  onChange={(e) => setArticleForm({ ...articleForm, description: e.target.value })}
                  className="text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              {/* Status & Featured Toggles */}
              <div className="flex items-center gap-6 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.published}
                    onChange={(e) => setArticleForm({ ...articleForm, published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#087BEA]"
                  />
                  <span className="font-semibold text-slate-700 text-xs">Publish on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.featured}
                    onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#087BEA]"
                  />
                  <span className="font-semibold text-slate-700 text-xs">Featured Article</span>
                </label>
              </div>

              {/* DYNAMIC ARTICLE SECTIONS */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Article Content Sections</h4>
                    <p className="text-[11px] text-slate-400">
                      Add sub-headings and paragraphs. Separate paragraphs with double Enter.
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddSection}
                    className="h-8 text-xs text-[#087BEA] border-blue-200 hover:bg-blue-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Section
                  </Button>
                </div>

                <div className="space-y-4">
                  {articleForm.sections.map((section, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Section {sIdx + 1}
                        </span>
                        {articleForm.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sIdx)}
                            className="text-slate-400 hover:text-red-600 text-xs font-semibold"
                          >
                            Remove Section
                          </button>
                        )}
                      </div>

                      <Input
                        placeholder="Section Heading (e.g. 1. Demand Transparent Reporting)"
                        value={section.heading}
                        onChange={(e) => handleSectionHeadingChange(sIdx, e.target.value)}
                        className="h-8 text-xs bg-white border-slate-200 font-bold"
                      />

                      <Textarea
                        rows={4}
                        placeholder="Section body text. Add multiple paragraphs by pressing Enter twice..."
                        value={section.bodyText}
                        onChange={(e) => handleSectionBodyChange(sIdx, e.target.value)}
                        className="text-xs bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-9 text-xs bg-[#087BEA] text-white hover:bg-[#087BEA]/90">
                  {editingArticleId ? "Save Changes" : "Publish Article"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FAQ EDITOR MODAL                                               */}
      {/* ============================================================== */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-base text-[#092B55]">
                {editingFaqId ? "Edit FAQ" : "Add FAQ Question"}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Question *</Label>
                <Input
                  required
                  placeholder="e.g. How much do your digital marketing services cost?"
                  value={faqForm.q}
                  onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Answer *</Label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Detailed, transparent answer explaining your policy or process..."
                  value={faqForm.a}
                  onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                  className="text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Category</Label>
                  <select
                    value={faqForm.category}
                    onChange={(e) =>
                      setFaqForm({ ...faqForm, category: e.target.value as any })
                    }
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Services">Services</option>
                    <option value="Pricing">Pricing</option>
                    <option value="Process">Process</option>
                    <option value="Guarantees">Guarantees</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Sort Order</Label>
                  <Input
                    type="number"
                    min="1"
                    value={faqForm.order}
                    onChange={(e) =>
                      setFaqForm({ ...faqForm, order: Number(e.target.value) || 1 })
                    }
                    className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={faqForm.published}
                  onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#087BEA]"
                />
                <span className="font-semibold text-slate-700 text-xs">Visible on Website</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="h-9 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-9 text-xs bg-[#087BEA] text-white hover:bg-[#087BEA]/90">
                  Save FAQ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
