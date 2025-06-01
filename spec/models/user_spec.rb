require 'rails_helper'

RSpec.describe User, type: :model do
  subject do
    described_class.new(
      email: "user@example.com",
      password: "password",
      first_name: "John",
      last_name: "Doe"
    )
  end

  describe "validations" do
    it "is valid with valid attributes" do
      expect(subject).to be_valid
    end

    it "is not valid without an email" do
      subject.email = nil
      expect(subject).to_not be_valid
      expect(subject.errors[:email]).to include("can't be blank")
    end

    it "is not valid with a duplicate email" do
      subject.save!
      duplicate = described_class.new(
        email: subject.email,
        password: "anotherpass",
        first_name: "Jane",
        last_name: "Smith"
      )
      expect(duplicate).to_not be_valid
      expect(duplicate.errors[:email]).to include("has already been taken")
    end

    it "is not valid without a password" do
      subject.password = nil
      expect(subject).to_not be_valid
      expect(subject.errors[:password]).to include("can't be blank")
    end

    it "is not valid without a first name" do
      subject.first_name = nil
      expect(subject).to_not be_valid
      expect(subject.errors[:first_name]).to include("can't be blank")
    end

    it "is not valid without a last name" do
      subject.last_name = nil
      expect(subject).to_not be_valid
      expect(subject.errors[:last_name]).to include("can't be blank")
    end
  end

  describe "associations" do
    it { should have_many(:simulations) }
  end
end
