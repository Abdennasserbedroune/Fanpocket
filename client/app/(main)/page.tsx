export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Fanpocket
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your companion for Moroccan football
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🏟️</div>
            <h3 className="text-lg font-semibold mb-2">Discover Stadiums</h3>
            <p className="text-gray-600">
              Explore stadiums across Morocco with interactive maps
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚽</div>
            <h3 className="text-lg font-semibold mb-2">Track Matches</h3>
            <p className="text-gray-600">
              Follow live scores and upcoming fixtures
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold mb-2">Follow Teams</h3>
            <p className="text-gray-600">Get updates on your favorite teams</p>
          </div>
        </div>
      </div>
    </div>
  );
}
