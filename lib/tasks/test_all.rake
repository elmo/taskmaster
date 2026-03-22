# Change 'namespace :test' to something unique like 'spec' or 'ci'
namespace :ci do
  desc "Migrate, Build, and Run RSpec + Vitest"
  task :all do
    # GOOD: Use the built-in Rails task
    system("bin/rails test:system")

    puts "--- 🔍 Linting Ruby (RuboCop) ---"
    ruby_lint_success = system("bundle exec rubocop")

    puts "--- Preparing Database ---"
    system("bin/rails db:test:prepare")

    puts "--- Running RSpec ---"
    rspec_success = system("bundle exec rspec")

    puts "--- Running Vitest ---"
    vitest_success = system("npx vitest run app/javascript")

    if rspec_success && vitest_success && ruby_lint_success
     puts "--- All tests passed ---"
     exit(0)
    else
    puts "--- Some tests failed ---"
     puts "Rspec failed" unless rspec_success
     puts "Vitest failed" unless vitest_success
     puts "Rubcop  failed" unless ruby_lint_success
     exit(1)
    end
  end
end
