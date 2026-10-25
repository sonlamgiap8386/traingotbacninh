import React, { useState, useRef } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  Award,
  MapPin,
  TrendingUp,
  Edit3,
  Trash2,
  MoreVertical,
  Check,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Plus,
  Save,
} from 'lucide-react';
import { COMMUNITY_POSTS, FARMER_ACCOUNTS } from '../data/mockData';
import { CommunityPost, FarmerAccount } from '../types/agriculture';
import { publicAssetUrl } from '../utils/assetUrl';

interface CommunityTabProps {
  currentFarmer?: FarmerAccount;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({ currentFarmer }) => {
  const activeFarmer = currentFarmer || FARMER_ACCOUNTS[0];

  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [newPostText, setNewPostText] = useState<string>('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string>('Tất cả');
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);

  // Edit Post Modal state
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  // Delete confirmation state
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Hidden file input refs
  const newPostFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check if a post belongs to the currently logged in farmer account
  const isOwnPost = (post: CommunityPost) => {
    return (
      (post.authorId && post.authorId === activeFarmer.id) ||
      post.author.name.trim().toLowerCase() === activeFarmer.name.trim().toLowerCase()
    );
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const hasLiked = post.hasLiked;
          return {
            ...post,
            hasLiked: !hasLiked,
            likes: hasLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: activeFarmer.name,
            avatar: activeFarmer.avatar,
            village: activeFarmer.commune || activeFarmer.shortLocation,
            content: text,
            timeAgo: 'Vừa xong',
          };
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  // Handle uploading image for new post
  const handleUploadNewPostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPostImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle uploading image when editing post
  const handleUploadEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: activeFarmer.id,
      author: {
        name: activeFarmer.name,
        avatar: activeFarmer.avatar,
        village: activeFarmer.commune || activeFarmer.shortLocation,
        badge: activeFarmer.role || 'Nhà vườn tiêu biểu phường Chũ, TP. Bắc Ninh',
      },
      timeAgo: 'Vừa xong',
      content: newPostText.trim(),
      images: newPostImage ? [newPostImage] : [publicAssetUrl('assets/aistudio/cam_duong_canh_1791794891255_d0cb0660.jpg')],
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: [],
      tags: ['#NhàVườnChũBắcNinh', '#ChiaSẻKinhNghiệm'],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostImage(null);
    showToast('Đã đăng bài viết mới lên diễn đàn nhà nông!');
  };

  // Open Edit Modal for a post
  const handleStartEdit = (post: CommunityPost) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditTags(post.tags ? [...post.tags] : []);
    setEditImages(post.images ? [...post.images] : []);
    setCustomTagInput('');
    setActiveMenuPostId(null);
  };

  // Save edits
  const handleSaveEdit = () => {
    if (!editingPost) return;
    if (!editContent.trim()) {
      showToast('Nội dung bài viết không được để trống.');
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            content: editContent.trim(),
            tags: editTags.length > 0 ? editTags : ['#KinhNghiệmNhàVườn'],
            images: editImages,
            isEdited: true,
          };
        }
        return p;
      })
    );

    setEditingPost(null);
    showToast('Đã lưu chỉnh sửa bài viết của bạn thành công!');
  };

  // Delete post
  const handleConfirmDelete = () => {
    if (!deletingPostId) return;
    setPosts((prev) => prev.filter((p) => p.id !== deletingPostId));
    setDeletingPostId(null);
    showToast('Đã xóa bài viết khỏi diễn đàn.');
  };

  // Add custom tag during editing
  const handleAddCustomTag = () => {
    const raw = customTagInput.trim();
    if (!raw) return;
    const formattedTag = raw.startsWith('#') ? raw : `#${raw}`;
    if (!editTags.includes(formattedTag)) {
      setEditTags([...editTags, formattedTag]);
    }
    setCustomTagInput('');
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((t) => t !== tagToRemove));
  };

  const handleRemoveEditImage = (indexToRemove: number) => {
    setEditImages(editImages.filter((_, idx) => idx !== indexToRemove));
  };

  const availableSuggestedTags = [
    '#VảiThiềuChũ',
    '#CamCanhTânMộc',
    '#GiáNôngSảnHômNay',
    '#KỹThuậtHãmLộcĐông',
    '#NôngDânChũBắcNinh',
    '#BưởiDiễnQuýSơn',
    '#VietGAP',
    '#SâuBệnhMùaXuân',
  ];

  const tags = [
    'Tất cả',
    '#VảiThiềuChũ',
    '#CamCanhTânMộc',
    '#GiáNôngSảnHômNay',
    '#KỹThuậtHãmLộcĐông',
    '#NôngDânChũBắcNinh',
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeTag === 'Tất cả') return true;
    return p.tags && p.tags.includes(activeTag);
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto font-['Times_New_Roman',Times,serif]">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Diễn Đàn Nhà Nông Phường Chũ, TP. Bắc Ninh
            </h2>
            <p className="text-xs text-slate-500">
              Kết nối hơn 2.400 hộ nông dân và kỹ sư khuyến nông toàn phường Chũ, TP. Bắc Ninh.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-800">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Hợp tác xã Kiểu mẫu</span>
        </div>
      </div>

      {/* Create New Post Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-start gap-3">
          <img
            src={activeFarmer.avatar}
            alt={activeFarmer.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-400"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-extrabold text-xs text-slate-900">{activeFarmer.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                Tài khoản đang đăng nhập
              </span>
            </div>

            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Chia sẻ kinh nghiệm làm vườn, cập nhật tình hình sâu bệnh, giá cả hoặc hỏi đáp kỹ thuật..."
              rows={3}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-emerald-500 focus:bg-white transition-all resize-none"
            />

            {/* Preview newly attached photo */}
            {newPostImage && (
              <div className="relative mt-2.5 inline-block rounded-xl overflow-hidden border border-emerald-300">
                <img
                  src={newPostImage}
                  alt="Ảnh chuẩn bị đăng"
                  className="w-40 h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNewPostImage(null)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full p-1 cursor-pointer transition-colors"
                  title="Gỡ ảnh"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <input
                  ref={newPostFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadNewPostImage}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => newPostFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>{newPostImage ? 'Đổi ảnh vườn' : 'Ảnh chụp vườn thực tế'}</span>
                </button>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!newPostText.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Đăng bài</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter by Topic / Tag */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTag === tag
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-5">
        {filteredPosts.map((post) => {
          const userOwnsThisPost = isOwnPost(post);

          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Author & Own Post Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-xs"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{post.author.name}</h3>
                      {userOwnsThisPost && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-700 text-white tracking-wide shadow-2xs">
                          Bài viết của bạn
                        </span>
                      )}
                      {post.author.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {post.author.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>{post.author.village}</span>
                      <span>·</span>
                      <span>{post.timeAgo}</span>
                      {post.isEdited && (
                        <span className="text-emerald-700 font-bold italic text-[11px] bg-emerald-50 px-1.5 py-0.2 rounded">
                          (Đã chỉnh sửa)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Chức năng sửa/xóa bài viết của người dùng */}
                {userOwnsThisPost && (
                  <div className="relative">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(post)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
                        title="Chỉnh sửa bài viết của bạn"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Sửa bài viết</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)
                        }
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Tùy chọn khác"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dropdown Menu */}
                    {activeMenuPostId === post.id && (
                      <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in slide-in-from-top-1">
                        <button
                          onClick={() => handleStartEdit(post)}
                          className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Chỉnh sửa nội dung</span>
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button
                          onClick={() => {
                            setDeletingPostId(post.id);
                            setActiveMenuPostId(null);
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Xóa bài viết</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post text */}
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Image Gallery */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-2xl overflow-hidden border border-slate-100">
                  {post.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Ảnh chia sẻ từ vườn"
                      className="w-full h-56 object-cover hover:scale-102 transition-transform duration-300"
                    />
                  ))}
                </div>
              )}

              {/* Post actions: Like, comment, share */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                      post.hasLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-600' : ''}`} />
                    <span>{post.likes} Yêu thích</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount} Bình luận</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {userOwnsThisPost && (
                    <button
                      onClick={() => handleStartEdit(post)}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px] mr-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa bài</span>
                    </button>
                  )}

                  <button className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Chia sẻ</span>
                  </button>
                </div>
              </div>

              {/* Comments list */}
              {post.comments.length > 0 && (
                <div className="space-y-2.5 pt-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5"
                      />
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-900">{comment.author}</span>
                          <span className="text-[10px] text-slate-400">{comment.timeAgo}</span>
                        </div>
                        <p className="text-slate-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Write comment input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Viết lời bình hoặc trao đổi kinh nghiệm..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment(post.id);
                    }
                  }}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-emerald-500 focus:bg-white transition-all"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  title="Gửi bình luận"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ================= MODAL CHỈNH SỬA BÀI VIẾT (EDIT POST MODAL) ================= */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-emerald-700" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-slate-900">
                    Chỉnh Sửa Bài Viết Của Bạn
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cập nhật nội dung, chủ đề hoặc hình ảnh chia sẻ với bà con nhà vườn
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingPost(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author indicator */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <img
                src={editingPost.author.avatar}
                alt={editingPost.author.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/50"
              />
              <div>
                <p className="font-extrabold text-xs text-slate-900">{editingPost.author.name}</p>
                <p className="text-[11px] text-emerald-800 font-medium">{editingPost.author.village}</p>
              </div>
            </div>

            {/* Textarea Content */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nội dung bài viết:
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={5}
                placeholder="Nhập nội dung chia sẻ..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-50 border border-slate-300 focus:outline-emerald-600 focus:bg-white transition-all resize-y"
              />
            </div>

            {/* Tags Editor */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Chủ đề gắn kèm (Tags):
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEditTag(tag)}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Tag */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Thêm tag mới (ví dụ: #CamĐườngCanh)..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTag();
                    }
                  }}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Thêm tag
                </button>
              </div>

              {/* Quick Suggested Tags */}
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Gợi ý:</span>
                {availableSuggestedTags.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      if (!editTags.includes(st)) {
                        setEditTags([...editTags, st]);
                      }
                    }}
                    disabled={editTags.includes(st)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 border border-slate-200 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    + {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Images Manager */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Hình ảnh đính kèm:</label>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadEditImage}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => editFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải ảnh mới từ máy</span>
                </button>
              </div>

              {editImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {editImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-slate-200 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`Ảnh đính kèm ${idx + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg p-1 shadow-md cursor-pointer transition-colors"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl text-center bg-slate-50 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">Chưa có ảnh nào được gắn</p>
                  <p className="text-[11px] text-slate-400">Nhấp để tải ảnh vườn thực tế</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA BÀI VIẾT ================= */}
      {deletingPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">Xác Nhận Xóa Bài Viết?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa bài viết này khỏi diễn đàn cộng đồng? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setDeletingPostId(null)}
                className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
