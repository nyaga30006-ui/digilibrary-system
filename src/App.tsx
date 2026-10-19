import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Library, 
  PlusCircle, 
  LayoutDashboard, 
  Search, 
  User, 
  CheckCircle2, 
  XCircle,
  Clock,
  Activity
} from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state for borrowing
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedBookToBorrow, setSelectedBookToBorrow] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');

  // Initial mock data generation
  useEffect(() => {
    const categories = ['Fiction', 'Science', 'Engineering', 'History', 'Philosophy'];
    const kenyanNames = ['James Kamau', 'Mary Wanjiku', 'David Ochieng', 'Sarah Mutua', 'Peter Kiprono', 'Grace Achieng', 'Kevin Njoroge', 'Elizabeth Anyango', 'John Doe', 'Alice Smith'];
    
    const mockBooks = Array.from({ length: 50 }, (_, i) => {
      const isBorrowed = Math.random() > 0.6;
      const bDate = isBorrowed ? new Date(Date.now() - Math.random() * 2000000000) : null;
      
      return {
        id: i + 1,
        refNumber: `DL-${1000 + i}`,
        title: `Book Title ${i + 1}`,
        author: `Author ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        dateAdded: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        status: isBorrowed ? 'Borrowed' : 'Available',
        borrowDate: isBorrowed ? bDate.toISOString().split('T')[0] : null,
        borrower: isBorrowed ? kenyanNames[Math.floor(Math.random() * kenyanNames.length)] : null,
        daysBorrowed: isBorrowed ? Math.floor((new Date() - bDate) / (1000 * 60 * 60 * 24)) : 0
      };
    });

    const mockActivities = [
      { id: 1, text: 'James Kamau borrowed "Book Title 12"', time: '2 hours ago' },
      { id: 2, text: 'Mary Wanjiku returned "Book Title 5"', time: '5 hours ago' },
      { id: 3, text: 'New book "Advanced Physics" added to catalog', time: '1 day ago' },
    ];

    setBooks(mockBooks);
    setActivities(mockActivities);
  }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBook = {
      id: books.length + 1,
      refNumber: formData.get('refNumber'),
      title: formData.get('title'),
      author: formData.get('author'),
      category: formData.get('category'),
      dateAdded: formData.get('dateAdded'),
      status: 'Available',
      borrower: null,
      borrowDate: null,
      daysBorrowed: 0
    };
    setBooks([newBook, ...books]);
    
    setActivities([{
      id: Date.now(),
      text: `New book "${newBook.title}" added to catalog`,
      time: 'Just now'
    }, ...activities]);

    e.target.reset();
    setActiveTab('catalog');
  };

  const confirmBorrow = () => {
    if (!borrowerName.trim()) return;
    
    setBooks(books.map(book => 
      book.id === selectedBookToBorrow.id 
        ? { 
            ...book, 
            status: 'Borrowed', 
            borrower: borrowerName,
            borrowDate: new Date().toISOString().split('T')[0],
            daysBorrowed: 0
          } 
        : book
    ));

    setActivities([{
      id: Date.now(),
      text: `${borrowerName} borrowed "${selectedBookToBorrow.title}"`,
      time: 'Just now'
    }, ...activities]);

    setBorrowModalOpen(false);
    setBorrowerName('');
    setSelectedBookToBorrow(null);
  };

  const handleReturnBook = (book) => {
    setBooks(books.map(b => 
      b.id === book.id 
        ? { ...b, status: 'Available', borrower: null, borrowDate: null, daysBorrowed: 0 } 
        : b
    ));

    setActivities([{
      id: Date.now(),
      text: `${book.borrower} returned "${book.title}"`,
      time: 'Just now'
    }, ...activities]);
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.refNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm">
        <div className="p-6 flex items-center text-blue-600">
          <Library size={28} />
          <span className="ml-2 text-xl font-bold">Digilibrary</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'catalog' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
            <BookOpen size={20} className="mr-3" /> Catalog
          </button>
          <button onClick={() => setActiveTab('borrowed')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'borrowed' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Clock size={20} className="mr-3" /> Borrowed Books
          </button>
          <button onClick={() => setActiveTab('add')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === 'add' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
            <PlusCircle size={20} className="mr-3" /> Add New Book
          </button>
        </nav>
        {/* Footer */}
        <div className="mt-auto p-4 text-center text-xs text-gray-400 border-t border-gray-100">
          made by digilogs
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-blue-100 rounded-full text-blue-600 mr-4"><BookOpen size={24} /></div>
                  <div><p className="text-gray-500 font-medium">Total Books</p><p className="text-3xl font-bold">{books.length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-green-100 rounded-full text-green-600 mr-4"><CheckCircle2 size={24} /></div>
                  <div><p className="text-gray-500 font-medium">Available</p><p className="text-3xl font-bold">{books.filter(b => b.status === 'Available').length}</p></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                  <div className="p-4 bg-amber-100 rounded-full text-amber-600 mr-4"><User size={24} /></div>
                  <div><p className="text-gray-500 font-medium">Borrowed</p><p className="text-3xl font-bold">{books.filter(b => b.status === 'Borrowed').length}</p></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 flex items-center"><Activity className="mr-2" size={20}/> Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map(activity => (
                    <div key={activity.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <p className="text-gray-700">{activity.text}</p>
                      <span className="text-sm text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Catalog Tab */}
          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Library Catalog</h2>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 font-medium text-gray-600">Ref No.</th>
                      <th className="p-4 font-medium text-gray-600">Title & Author</th>
                      <th className="p-4 font-medium text-gray-600">Category</th>
                      <th className="p-4 font-medium text-gray-600">Status</th>
                      <th className="p-4 font-medium text-gray-600 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map(book => (
                      <tr key={book.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-500 font-mono">{book.refNumber}</td>
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-sm text-gray-500">{book.author}</p>
                        </td>
                        <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{book.category}</span></td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {book.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {book.status === 'Available' ? (
                            <button onClick={() => { setSelectedBookToBorrow(book); setBorrowModalOpen(true); }} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium">
                              Borrow
                            </button>
                          ) : (
                            <button onClick={() => handleReturnBook(book)} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Borrowed Tab */}
          {activeTab === 'borrowed' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Currently Borrowed</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 font-medium text-gray-600">Book</th>
                      <th className="p-4 font-medium text-gray-600">Borrower</th>
                      <th className="p-4 font-medium text-gray-600">Date Borrowed</th>
                      <th className="p-4 font-medium text-gray-600">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.filter(b => b.status === 'Borrowed').map(book => (
                      <tr key={book.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-500 font-mono">{book.refNumber}</p>
                        </td>
                        <td className="p-4 text-gray-700">{book.borrower}</td>
                        <td className="p-4 text-gray-500">{book.borrowDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${book.daysBorrowed > 14 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {book.daysBorrowed} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Book Tab */}
          {activeTab === 'add' && (
            <div className="max-w-2xl space-y-6">
              <h2 className="text-2xl font-bold">Register New Book</h2>
              <form onSubmit={handleAddBook} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input required name="title" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Things Fall Apart" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input required name="author" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Chinua Achebe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                    <input required name="refNumber" type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. DL-2051" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option>Fiction</option>
                      <option>Science</option>
                      <option>Engineering</option>
                      <option>History</option>
                      <option>Philosophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Added</label>
                    <input required name="dateAdded" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium">
                    <PlusCircle size={20} className="mr-2" /> Save to Catalog
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Borrow Modal */}
      {borrowModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Borrow Book</h3>
              <button onClick={() => setBorrowModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-800">{selectedBookToBorrow?.title}</p>
                <p className="text-sm text-gray-500">by {selectedBookToBorrow?.author}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrower's Full Name</label>
                <input
                  autoFocus
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  placeholder="e.g. James Kamau"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') confirmBorrow(); }}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setBorrowModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={confirmBorrow} disabled={!borrowerName.trim()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg">Confirm Borrow</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}