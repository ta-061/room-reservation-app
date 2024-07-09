class CreateReservations < ActiveRecord::Migration[7.1]
  def change
    create_table :reservations do |t|
      t.string :user_name
      t.string :classroom_name
      t.datetime :start_time
      t.datetime :end_time
      t.string :password_digest
      t.integer :classroom_id 

      t.timestamps
    end
  end
end
